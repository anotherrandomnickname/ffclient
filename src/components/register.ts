/* Lazy loading of component. */
export default function registerComponent(component: string): () => any {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/components/${component}.vue`)
}

/* Place for component filenames and specific names for them. Example "ButtonSama.vue" => "Buttonsama". */
enum ComponentsEnumenator {
  'button-chan' = 'ButtonChan',
  'text-editor-san' = 'TextEditor',
  'button-sama' = 'ButtonSama',
  'form-placeholder' = 'Form',
  'input-chan' = 'Input',
  'modal-kun' = 'ModalKun',
  'chat-kun' = 'ChatKun',
}

/* 
*** Typechecker for compiler. 
*** Please, do not forget to register component in ComponentOptions and ComponentsEnumerator for validation.
*/
type ComponentOptions =
  | 'button-chan'
  | 'text-editor-san'
  | 'button-sama'
  | 'form-placeholder'
  | 'input-chan'
  | 'modal-kun'
  | 'chat-kun'

/*   
  *** Defines legal name of component for lazy-loading.
  *** Every invalid name will throw an error.
  *** DO NOT USE THIS CODE IN PRODUCTION
*/

export function register(namespace: string[]): any {
  const components = {}
  for (const component of namespace) {
    let componentOption: ComponentOptions
    const legalComponent: ComponentsEnumenator =
      ComponentsEnumenator[
        (componentOption = component as keyof typeof ComponentsEnumenator)
      ]
    if (legalComponent) {
      Object.assign(components, {
        [component]: registerComponent(legalComponent),
      })
    } else {
      throw new Error('Invalid registered name component')
    }
  }
  return components
}

/* PRODUCTION CODE */

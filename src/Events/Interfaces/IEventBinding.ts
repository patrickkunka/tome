interface IEventBinding {
    type: string;
    target?: HTMLElement|Window|Document;
    debounce?: number;
    handler?: (e: Event) => any;
}

export default IEventBinding;
import {pascalCase}  from '../../Shared/Util';
import EventBinding  from '../EventBinding';
import IEventBinding from '../Interfaces/IEventBinding';
import debounce      from '../Util/debounce';

function bindEvent(context: any, defaultTarget: HTMLElement, eventBindingRaw: (string|IEventBinding)): EventBinding {
    const eventBinding = new EventBinding(eventBindingRaw);

    if (!eventBinding.target) eventBinding.target = defaultTarget;

    const handlerName = `handle${pascalCase(eventBinding.type)}`;
    const handler = context[handlerName];

    if (typeof handler !== 'function') {
        throw new TypeError(
            `[Tome] No "${handlerName}" handler method found for event type "${eventBinding.type}"`
        );
    }

    const boundHandler = handler.bind(context);

    eventBinding.handler = (eventBinding.debounce <= 0) ?
        boundHandler : debounce(boundHandler, eventBinding.debounce, true);

    eventBinding.target.addEventListener(eventBinding.type, eventBinding.handler);

    return eventBinding;
}

export default bindEvent;
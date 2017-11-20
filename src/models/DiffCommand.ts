import ChangeType from '../constants/ChangeType';

class DiffCommand {
    type: ChangeType;
    newEl: HTMLElement=null;
    newInnerHtml: string='';
    newTextContent: string='';
    childCommands: Array<DiffCommand>=[];
}

export default DiffCommand;
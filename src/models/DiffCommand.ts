import ChangeType from '../constants/ChangeType';

class DiffCommand {
    public type:           ChangeType;
    public newNode:        Node          = null;
    public newInnerHtml:   string        = '';
    public newTextContent: string        = '';
    public childCommands:  DiffCommand[] = [];
}

export default DiffCommand;
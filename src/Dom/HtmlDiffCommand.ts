import HtmlChangeType from './Constants/HtmlChangeType';

class DiffCommand {
    public type:           HtmlChangeType;
    public newNode:        Node          = null;
    public newInnerHtml:   string        = '';
    public newTextContent: string        = '';
    public childCommands:  DiffCommand[] = [];
}

export default DiffCommand;
interface ICustomBlockRenderers {
    [name: string]: (type: string, data: any) => string;
}

export default ICustomBlockRenderers;
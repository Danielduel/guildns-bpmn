type BPMNContent = unknown;

type ConstructorOpts = {
  container: string;
  additionalModules?: unknown[];
};

type ImportXMLResult = {
  warnings: unknown;
};

class BPMNGeneric {
  constructor (opts: ConstructorOpts) {}
  importXML (fileContent: BPMNContent): Promise<ImportXMLResult>;
}

declare module "bpmn-js/lib/NavigatedViewer" {
  export default BPMNGeneric;
}

declare module "bpmn-js" {
  export default class {
    constructor () {}
    attach (container: string) {}
  }
}

declare module "bpmn-js/lib/Modeler" {
  export default BPMNGeneric;
}

declare module "bpmn-js-embedded-comments" {
  const content: unknown;
  export default content;
}

declare module '\*.bpmn' {
  const content: BPMNContent;
  export default content;
}


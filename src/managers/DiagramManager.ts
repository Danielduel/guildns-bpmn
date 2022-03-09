import {DiagramData, DiagramMetaId, DiagramMeta, storageApi} from "../storage";

type DiagramMeta_creatable = Omit<DiagramMeta, "id" | "lastDiagramDataId">;
type DiagramData_creatable = Omit<DiagramData, "id">;

export type Diagram = {
  _diagramMeta: DiagramMeta;
  _diagramData: DiagramData;

  name: string;
  author: string;
  createdTime: number;
  lastModifiedBy: string;
  lastModifiedTime: number;
  xml: string;
};
const isT = <T>(v: T | null | undefined): v is T => !!v;

export class DiagramManager {
  static async list() {
    const metaKeys = await storageApi.keys("diagramMeta");
    const diagramsDirty = await Promise.all(metaKeys.map(DiagramManager.load));
    const diagrams = diagramsDirty.filter(isT);
    return diagrams;
  }
  static async load(metaId: DiagramMetaId) {
    const meta = await storageApi.get("diagramMeta", metaId) as DiagramMeta; // | undefined;
    if (!meta) return; // error?
    if (!meta.lastDiagramDataId) return; // error?

    const data = await storageApi.get("diagramData", meta.lastDiagramDataId) as DiagramData; // |  undefined;
    if (!data) return; // error?

    const result: Diagram = {
      _diagramMeta: meta,
      _diagramData: data,

      name: meta.diagramName,
      author: meta.author,
      createdTime: meta.timestamp,

      lastModifiedBy: data.author,
      lastModifiedTime: data.timestamp,
      xml: data.xmlData
    };

    return result;
  }
  static async save(
    metaId: DiagramMetaId,
    diagramXml: string
  ) {
    const meta = await storageApi.get("diagramMeta", metaId) as DiagramMeta; // | undefined;
    if (!meta) return; // error?
    if (!meta.lastDiagramDataId) return; // error?

    const author = meta.author;
    const timestamp = Date.now();
    const data: DiagramData_creatable = {
      author,
      timestamp,
      diagramMetaId: metaId,
      xmlData: diagramXml
    };
    const dataId = await storageApi.set("diagramData", data as DiagramData);
    
    await storageApi.set("diagramMeta", {
      ...meta,
      id: metaId,
      lastDiagramDataId: dataId
    }); 
  }
  static async create(author: string, diagramName: string) {
    const timestamp = Date.now();
    const meta: DiagramMeta_creatable = {
      diagramName,
      timestamp,
      author,
    };
    const metaId = await storageApi.set("diagramMeta", meta as DiagramMeta);
    const data: DiagramData_creatable = {
      author,
      timestamp,
      diagramMetaId: metaId,
      xmlData: ""
    };
    const dataId = await storageApi.set("diagramData", data as DiagramData);
    console.log(metaId, dataId);
    await storageApi.set("diagramMeta", {
      ...meta,
      id: metaId,
      lastDiagramDataId: dataId
    });
  }

  static async delete(diagram: Diagram) {
    return await Promise.all([
      storageApi.del("diagramMeta", diagram._diagramMeta.id),
      storageApi.del("diagramData", diagram._diagramData.id)
    ]);
  }
}


import {DiagramData_v2, DiagramMetaId, DiagramMeta_v2, storage, storageApi} from "../storage";

type DiagramMeta_v2_creatable = Omit<DiagramMeta_v2, "id" | "lastDiagramDataId">;
type DiagramData_v2_creatable = Omit<DiagramData_v2, "id">;

type Diagram = {
  _diagramMeta: DiagramMeta_v2;
  _diagramData: DiagramData_v2;

  name: string;
  author: string;
  createdTime: number;
  lastModifiedBy: string;
  lastModifiedTime: number;
  xml: string;
};
const isT = <T>(v: T | null | undefined): v is T => !!v;

export class DiagramMetadataManager {
  static async list() {
    const metaKeys = await storageApi.keys("diagramMeta_v2");
    const diagramsDirty = await Promise.all(metaKeys.map(DiagramMetadataManager.load));
    const diagrams = diagramsDirty.filter(isT);
    return diagrams;
  }
  static async load(metaId: DiagramMetaId) {
    const meta = await storageApi.get("diagramMeta_v2", metaId) as DiagramMeta_v2; // | undefined;
    if (!meta) return; // error?

    const data = await storageApi.get("diagramData_v2", meta.lastDiagramDataId) as DiagramData_v2; // |  undefined;
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
  static async save() {

  }
  static async create(author: string, diagramName: string) {
    const timestamp = Date.now();
    const meta: DiagramMeta_v2_creatable = {
      diagramName,
      timestamp,
      author
    };
    const metaId = await storageApi.set("diagramMeta_v2", meta as DiagramMeta_v2);
    const data: DiagramData_v2_creatable = {
      author,
      timestamp,
      diagramMetaId: metaId,
      xmlData: ""
    };
    const dataId = await storageApi.set("diagramData_v2", data as DiagramData_v2);
    await storageApi.set("diagramMeta_v2", {
      ...meta,
      lastDiagramDataId: dataId
    } as DiagramMeta_v2, metaId);
  }
}


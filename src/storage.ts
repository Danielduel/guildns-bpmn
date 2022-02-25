import {openDB, DBSchema, IDBPDatabase} from "idb";

export type DiagramDataId = string;
export type DiagramMetaId = string;
type CreatedByUser<T> = {
  id: T;
  author: string;
  timestamp: number;
};

export type DiagramData2DiagramMeta = DiagramMetaId;
export type DiagramMeta2LastDiagramModifiedData = DiagramDataId;
export type DiagramData = CreatedByUser<DiagramDataId> & {
  diagramMetaId: DiagramMetaId;
  xmlData: string;
};
export type DiagramMeta = CreatedByUser<DiagramMetaId> & {
  lastDiagramDataId: DiagramDataId;
  diagramName: string;
};

export interface DiagramDB extends DBSchema {
  diagramMeta: {
    key: DiagramMetaId;
    value: DiagramMeta;
  };
  diagramData: {
    key: DiagramDataId;
    value: DiagramData;
  };
};

export type StorageType = IDBPDatabase<DiagramDB>;

const upgrade = (db: IDBPDatabase<DiagramDB>) => {
  // @ts-ignore - prevent name check
  const deleteObjectStore = (name: string) => db.objectStoreNames.contains(name) && db.deleteObjectStore(name);

  switch (db.version) {
    // @ts-ignore - prevent warn about fallthrough case
    case 1:
      deleteObjectStore("diagramSave");
      deleteObjectStore("diagramFile");
    // @ts-ignore - prevent warn about fallthrough case
    case 2:
      deleteObjectStore("diagramMeta_v2");
      deleteObjectStore("diagramData_v2");
  }

  const diagramMetaStore = db.createObjectStore("diagramMeta", {keyPath: "id", autoIncrement: true});
  const diagramDataStore = db.createObjectStore("diagramData", {keyPath: "id", autoIncrement: true});
  // diagramDataStore.createIndex("diagramMetaId", "diagramMetaId");
  // diagramMetaStore.createIndex("lastDiagramDataId", "lastDiagramDataId");
};

const createStorage = () => {
  return openDB<DiagramDB>("diagramDb", 3, {
    upgrade
  });
};

export const storage = createStorage();
type P<
  MethodName extends keyof StorageType
  > = Parameters<
    StorageType[MethodName] extends (...args: any) => any
    ? StorageType[MethodName]
    : (...args: any) => any
  >;

export const storageApi = {
  get: async function (...params: P<"get">) {
    return (await storage).get(...params);
  },
  set: async function (...params: P<"put">) {
    return (await storage).put(...params);
  },
  del: async function (...params: P<"delete">) {
    return (await storage).delete(...params);
  },
  clear: async function (...params: P<"clear">) {
    return (await storage).clear(...params);
  },
  keys: async function (...params: P<"getAllKeys">) {
    return (await storage).getAllKeys(...params);
  }
};


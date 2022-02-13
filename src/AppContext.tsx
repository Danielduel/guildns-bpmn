import React, {ReactChild} from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import BpmnModeler from "bpmn-js/lib/Modeler";
import EmbeddedComments from "bpmn-js-embedded-comments";
import {createStorage} from "./storage";
import newDiagramUrl from "./mock/newDiagram.bpmn";

export type AppType = "modeler" | "viewer";
export type StorageType = ReturnType<typeof createStorage>["storage"];
export type StorageStatusType = ReturnType<typeof createStorage>["storageStatus"];

const currentNull = { current: null };
const defaultAppContext = {
  storage: currentNull as React.RefObject<null | StorageType>,
  storageStatus: currentNull as React.RefObject<null | StorageStatusType>,
  viewer: null as BpmnViewer | null,
  newDiagramRaw: null as string | null,
  saveCurrentDiagram: () => {}
};

export const AppContext = React.createContext(defaultAppContext);
type AppContextProviderProps = {
  children: ReactChild;
};

export const createAppContextProvider = (appType: AppType) => {
  const BpmnMainComponent = appType === "modeler" ? BpmnModeler : BpmnViewer;

  const AppContextProvider = ({children}: AppContextProviderProps) => {
    const storage = React.useRef<null | StorageType>(null);
    const storageStatus = React.useRef<null | StorageStatusType>(null);
    const [viewer, setViewer] = React.useState<typeof defaultAppContext["viewer"]>(null);
    const [newDiagramRaw, setNewDiagramRaw] = React.useState<typeof defaultAppContext["newDiagramRaw"]>(null);

    React.useEffect(() => {
      const {storage: _storage, storageStatus: _storageStatus} = createStorage();
      storage.current = _storage;
      storageStatus.current = _storageStatus;
    }, []);

    React.useEffect(() => {
      fetch(newDiagramUrl as string)
        .then(res => res.blob())
        .then(blob => blob.text())
        .then(setNewDiagramRaw);
    }, [setNewDiagramRaw]);

    React.useEffect(() => {
      const _viewer = new BpmnMainComponent({
        container: "body",
        additionalModules: [EmbeddedComments]
      });
      setViewer(_viewer);
      // Since this lib doesn't provide good typings
      // (or I am too blind to find good ones)
      // binding actual viewer to window for debug purposes
      // @ts-ignore
      window._viewer = _viewer;
    }, [setViewer]);

    const saveCurrentDiagram = React.useCallback(() => {
      return viewer?.saveXML()
        .then(({xml}) => {
          storage.current?.setContents("Test diagram", xml);
        });
    }, [viewer, storage]);

    return (
        <AppContext.Provider value={{
        storage,
        storageStatus,
        viewer,
        newDiagramRaw,
        saveCurrentDiagram
      }}>
        {children}
      </AppContext.Provider>
    );
  };

  return AppContextProvider;
}


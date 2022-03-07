import React, { ReactChild } from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import BpmnModeler from "bpmn-js/lib/Modeler";
import EmbeddedComments from "bpmn-js-embedded-comments";
import { storage, DiagramDB } from "./storage";
import newDiagramUrl from "./mock/newDiagram.bpmn";
// import newDiagramUrl from "./mock/pizza-collaboration-annotated.bpmn";
import { IDBPDatabase } from "idb";
import { Diagram, DiagramManager } from "./managers/DiagramManager";

export type AppType = "modeler" | "viewer";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
const defaultAppContext = {
  viewer: null as BpmnViewer | null,
  currentDiagram: null as Diagram | null,
  newDiagramRaw: null as string | null,
  openDiagram: (diagram: Diagram) => {},
  saveCurrentDiagram: () => {},
  diagramMenuOpen: true,
  setDiagramMenuOpen: (() => {}) as SetState<boolean>
};

export const AppContext = React.createContext(defaultAppContext);
export type AppContextType = typeof defaultAppContext;
type AppContextProviderProps = {
  children: ReactChild;
};

export const createAppContextProvider = (appType: AppType) => {
  const BpmnMainComponent = BpmnModeler; // appType === "viewer" ? BpmnViewer : BpmnModeler;

  const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [viewer, setViewer] =
      React.useState<typeof defaultAppContext["viewer"]>(null);
    const [currentDiagram, setCurrentDiagram] =
      React.useState<typeof defaultAppContext["currentDiagram"]>(null);
    const [newDiagramRaw, setNewDiagramRaw] =
      React.useState<typeof defaultAppContext["newDiagramRaw"]>(null);
    const [diagramMenuOpen, setDiagramMenuOpen] = React.useState(true);

    React.useEffect(() => {
      fetch(newDiagramUrl as string)
        .then((res) => res.blob())
        .then((blob) => blob.text())
        .then(setNewDiagramRaw);
    }, [setNewDiagramRaw]);

    React.useEffect(() => {
      const _viewer = new BpmnMainComponent({
        container: "#bpmnViewerCanvasId",
        additionalModules: [EmbeddedComments],
      });
      setViewer(_viewer);
      // Since this lib doesn't provide good typings
      // (or I am too blind to find good ones)
      // binding actual viewer to window for debug purposes
      // @ts-ignore
      window._viewer = _viewer;
    }, [setViewer]);
    const openDiagram = React.useCallback(
      (diagram: Diagram) => {
        setCurrentDiagram(diagram);

        if (diagram.xml) {
          viewer?.importXML(diagram.xml);
        } else {
          viewer?.importXML(newDiagramRaw);
        }

        setDiagramMenuOpen(false);
      },
      [viewer, newDiagramRaw, setDiagramMenuOpen, setCurrentDiagram]
    );

    const saveCurrentDiagram = React.useCallback(async () => {
      if (!currentDiagram) return; // error?
      const diagramXml = await viewer?.saveXML();
      if (!diagramXml) return; // error?
      const metaId = currentDiagram._diagramMeta.id;

      await DiagramManager.save(metaId, diagramXml.xml) 
    }, [currentDiagram]);

    return (
      <AppContext.Provider
        value={{
          viewer,
          currentDiagram,
          newDiagramRaw,
          saveCurrentDiagram,
          openDiagram,
          diagramMenuOpen,
          setDiagramMenuOpen
        }}
      >
        {children}
      </AppContext.Provider>
    );
  };

  return AppContextProvider;
};

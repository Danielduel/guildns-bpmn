import React, {useContext} from 'react';
import styled from "styled-components";
/*
import BpmnViewer from "bpmn-js/lib/Modeler";
import EmbeddedComments from "bpmn-js-embedded-comments";
import newDiagramUrl from "./mock/newDiagram.bpmn";
*/
import diagramUrl from "./mock/pizza-collaboration-2.bpmn";
import {DiagramMenu} from './DiagramMenu';
import {AppContext} from './AppContext';

const bpmnViewerCanvasId = "bpmnViewerCanvasId";
const StyledCanvas = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

function App() {
  const context = useContext(AppContext);

  React.useEffect(() => {
    if (context.viewer && context.newDiagramRaw) {
      context.viewer?.importXML(context.newDiagramRaw);
    }
  }, [context.viewer, context.newDiagramRaw])

  return (
    <div className="App">
      <DiagramMenu />
      <StyledCanvas id={bpmnViewerCanvasId}></StyledCanvas>
    </div>
  );
}

export default App;

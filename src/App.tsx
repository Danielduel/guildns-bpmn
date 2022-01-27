import React from 'react';
import styled from "styled-components";
import BpmnViewer from "bpmn-js/lib/Modeler";
// import EmbeddedComments from "bpmn-js-embedded-comments";
// import diagramUrl from "./mock/pizza-collaboration-annotated.bpmn";
// import newDiagramUrl from "./mock/newDiagram.bpmn";
import diagramUrl from "./mock/pizza-collaboration-2.bpmn";

const bpmnViewerCanvasId = "bpmnViewerCanvasId";
const StyledCanvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);  
  
  React.useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const viewer = new BpmnViewer({
        container: "body"
//        container: `#${bpmnViewerCanvasId}`,
//        additionalModules: [ EmbeddedComments ]
      });
      
      fetch(diagramUrl as string)
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(diagram => {
          console.log(diagram);
          return viewer.importXML(diagram)
        });
    }
  }, [canvasRef.current]);

  return (
    <div className="App">
      <StyledCanvas id="bpmnViewerCanvasId" ref={canvasRef} />
    </div>
  );
}

export default App;

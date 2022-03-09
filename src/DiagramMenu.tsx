import React from "react";
import styled from "styled-components";
import { AppContext, AppContextType } from "./AppContext";
import { Diagram, DiagramManager } from "./managers/DiagramManager";

const DiagramMenuWrapper = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #556;
`;

const DiagramMenuContainer = styled.div`
  position: relative;
  max-height: 90vh;
  width: 90vw;
  padding: 1rem;
  background-color: #668;
`;

const DiagramMenuItemContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px dotted gray;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
`;

const DiagramMenuItemDetails = styled.div``;

const DiagramMenuItemName = styled.div`
  font-size: 1.2rem;
`;
const DiagramMenuItemAuthor = styled.div`
  font-size: 0.8rem;
`;

const DiagramMenuItemActions = styled.div`
  display: flex;
  flex-direction: row;
`;

type WithUpdateList = {
  updateList: () => void;
};

type WithDiagramList = {
  diagramList: Diagram[];
};

type WithChildren = {
  children: React.ReactNode;
};

type WithDiagramModalClose = {
  diagramModalClose: () => void;
};

const DiagramMenuItem =
  (openDiagram: AppContextType["openDiagram"]) =>
  (diagramData: Diagram) =>
  (props: WithUpdateList) => {
    const { updateList } = props;

    return (
      <DiagramMenuItemContainer>
        <DiagramMenuItemDetails>
          <DiagramMenuItemName>{diagramData.name}</DiagramMenuItemName>
          <DiagramMenuItemAuthor>{diagramData.author}</DiagramMenuItemAuthor>
        </DiagramMenuItemDetails>
        <DiagramMenuItemActions>
          <button
            onClick={() => DiagramManager.delete(diagramData).then(updateList)}
          >
            Delete
          </button>
          <button onClick={() => openDiagram(diagramData)}>Edit</button>
          <button>View</button>
        </DiagramMenuItemActions>
      </DiagramMenuItemContainer>
    );
  };

const DiagramMenuList = (props: WithUpdateList & WithDiagramList) => {
  const { openDiagram } = React.useContext(AppContext);
  const { updateList, diagramList } = props;

  return (
    <>
      {diagramList.map(DiagramMenuItem(openDiagram)).map((X, index) => (
        <X key={index} updateList={updateList} />
      ))}
    </>
  );
};

const DiagramMenuCreate = (props: WithUpdateList & WithDiagramModalClose) => {
  const { updateList, diagramModalClose } = props;

  const [diagramName, setDiagramName] = React.useState("");
  const [author, setAuthor] = React.useState("");

  const buttonDisabled = !diagramName || !author;
  const createOnClick = React.useCallback(() => {
    DiagramManager.create(author, diagramName)
      .then(updateList)
      .then(diagramModalClose);
  }, [updateList, author, diagramName, diagramModalClose]);

  return (
    <>
      <input
        onChange={(e) => setDiagramName(e.target.value)}
        placeholder="Diagram Name"
      />
      <input onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      <button disabled={buttonDisabled} onClick={createOnClick}>
        Create
      </button>
      <button onClick={diagramModalClose}>Close</button>
    </>
  );
};

const WrapDiagramMenu = ({ children }: WithChildren) => (
  <DiagramMenuWrapper>
    <DiagramMenuContainer>{children}</DiagramMenuContainer>
  </DiagramMenuWrapper>
);

const DiagramMenu = () => {
  const [newDiagramModalOpen, setNewDiagramModalOpen] = React.useState(false);
  const [diagramList, setDiagramList] = React.useState<Diagram[]>([]);

  const updateList = React.useCallback(() => {
    DiagramManager.list().then((list) => setDiagramList(list));
  }, [setDiagramList]);

  React.useLayoutEffect(updateList, [updateList]);

  if (newDiagramModalOpen) {
    return (
      <WrapDiagramMenu>
        <DiagramMenuCreate
          updateList={updateList}
          diagramModalClose={() => setNewDiagramModalOpen(false)}
        />
      </WrapDiagramMenu>
    );
  }

  return (
    <WrapDiagramMenu>
      <DiagramMenuList updateList={updateList} diagramList={diagramList} />
      <button onClick={() => setNewDiagramModalOpen(true)}>Create</button>
    </WrapDiagramMenu>
  );
};

export { DiagramMenu };
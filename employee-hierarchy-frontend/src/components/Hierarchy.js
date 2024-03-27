import React, { useEffect, useState } from 'react';
import styled, {css} from 'styled-components';
import { fetchHierarchy, addOrUpdateEmployees } from '../services/hierarchyService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HierarchyTable = styled.table`
  margin: 20px;
  border-collapse: collapse;
  width: 600px
`;

const EmployeeCell = styled.td`
  padding: 5px;
  border: 1px solid #000;
  text-align: left;
  transition: background-color 0.3s; 
  ${({ isHighlighted }) => 
  isHighlighted && css`
    background-color: grey; 
    border: 1px solid grey;
  `}
`;
const DetailsForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin: 0px 20px
  max-width: 600px; 
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 3px;
  max-width: 350px;
`;

const Button = styled.button`
  width: 100px;
`;

const Hierarchy = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [maxEmptyCells, setMaxEmptyCells] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeNameNew, setEmployeeNameNew] = useState("");
  const [managerIdNew, setManagerIdNew] = useState("");
  const [employeeIdNew, setEmployeeIdNew] = useState("");


  const getHierarchy = async () => {
    try {
      const data = await fetchHierarchy();
      setHierarchy(data);
      setMaxEmptyCells(0); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHierarchy();
  }, []);

  const handleCellClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeName(employee.name);
    setManagerId(employee.managerId || 'CEO');
    setEmployeeId(employee.id);
  };
  
  const handleSubmit = async (event, employee) => {
    event.preventDefault();
    await addOrUpdateEmployees(employee);
    getHierarchy()
  };


  const renderHierarchy = (nodes, level = 0, currentMax = 0) => {
    let localMax = currentMax;
    nodes.forEach((node) => {
      const numEmptyCells = level;
      if (numEmptyCells > localMax) {
        localMax = numEmptyCells;
      }
      if (node.subordinates) {
        const subordinatesMax = renderHierarchy(node.subordinates, level + 1, localMax);
        if (subordinatesMax > localMax) {
          localMax = subordinatesMax;
        }
      }
    });

    if (localMax > maxEmptyCells) {
      setMaxEmptyCells(localMax);
    }
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <tr>
          {Array.from({ length: level }).map((_, index) => (
            <EmployeeCell key={index} />
          ))}
          <EmployeeCell
            onClick={() => handleCellClick(node)}
            isHighlighted={selectedEmployee?.id === node.id}
            colSpan={level > 0 ? 1 : nodes.length - 1}>
            {node.name}
          </EmployeeCell>
          {Array.from({ length: maxEmptyCells - level }).map((_, index) => (
            <EmployeeCell key={index} />
          ))}
        </tr>
        {node.subordinates && renderHierarchy(node.subordinates, level + 1, localMax)}
      </React.Fragment>
    ));
  };

  return (
    <Container>
        <HierarchyTable>
            <tbody>
            {hierarchy.length ? renderHierarchy(hierarchy) : <tr><td>Loading...</td></tr>}
            </tbody>
        </HierarchyTable>
        <h3>Click on the user details to show there details or/and edit them</h3>
        
     <ContainerRow>
        <Container style={{marginRight: '16px'}}>
            <DetailsForm onSubmit={(e)=>handleSubmit(e, {name: employeeName, id: employeeId, managerId: managerId})}>
                <h3>Edit Employee Details</h3>
                Name : <Input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                Manager Id : <Input type="text" value={managerId} onChange={(e) => setManagerId(e.target.value)} />
                Id : <Input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                <Container><Button type="submit">Submit</Button></Container>
            </DetailsForm>
        </Container>

        <Container>        
            <DetailsForm onSubmit={(e)=>handleSubmit(e, {name: employeeNameNew, id: employeeIdNew, managerId: managerIdNew})}>
                <h3>Add New User</h3>
                Name : <Input type="text" value={employeeNameNew} onChange={(e) => setEmployeeNameNew(e.target.value)} />
                Manager Id : <Input type="text" value={managerIdNew} onChange={(e) => setManagerIdNew(e.target.value)} />
                Id : <Input type="text" value={employeeIdNew} onChange={(e) => setEmployeeIdNew(e.target.value)} />
                <Container><Button type="submit">Submit</Button></Container>
            </DetailsForm>
        </Container>
      </ContainerRow>
    </Container>
  );
};

export default Hierarchy;

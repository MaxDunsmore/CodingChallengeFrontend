export const fetchHierarchy = async () => {
    try {
      const response = await fetch('http://localhost:3001/hierarchy'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Could not fetch the hierarchy data:", error);
      throw error;
    }
  };
  export const addOrUpdateEmployees = async (employeeData) => {
    try {
        console.log("employeeData : ",employeeData)
      const response = await fetch('http://localhost:3001/addEmployees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData), 
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return;
    } catch (error) {
      console.error("Could not add the employee/s :", error);
      throw error;
    }
  };
  
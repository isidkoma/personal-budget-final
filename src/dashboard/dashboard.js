import React, { useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { reactLocalStorage } from 'reactjs-localstorage';
import * as d3 from 'd3';

const BACKEND_URL = "http://155.138.193.44:3031";

function Dashboard() {
  const [budgetData, setBudgetData] = useState([]);
  const [income, setIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const barChartRef = useRef(null);

  const pieChartRef = useRef(null);

  let piechartInstance = null;
  
  let barChartInstance = null;

// eslint-disable-next-line
  useEffect(() => {
    const token = reactLocalStorage.get('jwt');

    if (token) {
      console.log(token);
      getBudget(token);
    } else {
      handleError('Token not available.');
    }
    // eslint-disable-next-line
  }, []);
 
  // eslint-disable-next-line
  useEffect(() => {
    createPieChart(budgetData);
    createBarChart(budgetData);
    createDonutChart(budgetData);
  
    // Cleanup function to destroy chart instances
    return () => {
      if (piechartInstance) {
        // eslint-disable-next-line
        piechartInstance.destroy();
        // eslint-disable-next-line
        piechartInstance = null;
      }
      // eslint-disable-next-line
      if (barChartInstance) {
        // eslint-disable-next-line
        barChartInstance.destroy();
        // eslint-disable-next-line
        barChartInstance = null;
      }
      // Add similar cleanup for donut chart if applicable
    };
  }, [budgetData, income, savings]); // Dependencies array, can be adjusted based on when you need to recreate the charts
  
  

  const getBudget = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data && data.ok === 1) {
        setBudgetData(data.budgetData);
        setIncome(data.income);
        setSavings(data.savings);
      } else {
        handleError(data.message || "Error in data response.");
      }
    } catch (error) {
      handleError(`Network Error: ${error.message}`);
    }
  };

  const addToBudget = async () => {
    const token = reactLocalStorage.get('jwt');
    const requestBody = { title, budget, color };

    try {
      const response = await fetch(`${BACKEND_URL}/api/add_budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data && data.ok === 1) {
        setBudgetData(data.budgetData);
      } else {
        handleError(data.message || "Error: Unknown error.");
      }
    } catch (error) {
      handleError(`Network Error: ${error.message}`);
    }
  };

  const deleteFromBudget = async (titleToDelete) => {
    const token = reactLocalStorage.get('jwt');

    try {
      const response = await fetch(`${BACKEND_URL}/api/delete_from_budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: titleToDelete }),
      });

      const data = await response.json();
      if (data && data.ok === 1) {
        setBudgetData(budgetData.filter(item => item.title !== titleToDelete));
      } else {
        handleError(data.message || "Error: Unknown error while deleting.");
      }
    } catch (error) {
      handleError(`Network Error: ${error.message}`);
    }
  };

  const updateIncome = async () => {
    const token = reactLocalStorage.get('jwt');
    const requestBody = { token, income }; // Assuming 'income' is a state variable
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/update_income`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data && data.ok === 1) {
        setIncome(data.income); // Update the 'income' state with the new value
      } else {
        handleError(data.error || "Error: Unknown error.");
      }
    } catch (error) {
      handleError(`Network Error: ${error.message}`);
    }
  };
  

  const updateSavings = async () => {
    const token = reactLocalStorage.get('jwt');
    const requestBody = { token, savings }; // Assuming 'savings' is a state variable
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/update_savings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data && data.ok === 1) {
        setSavings(data.savings); // Update the 'savings' state with the new value
      } else {
        handleError(data.error || "Error: Unknown error.");
      }
    } catch (error) {
      handleError(`Network Error: ${error.message}`);
    }
  };
  

  const createPieChart = (budgetData) => {
    if (pieChartRef.current && !piechartInstance) {
      // eslint-disable-next-line
      const pieChartContext = pieChartRef.current.getContext('2d');
  
      piechartInstance = new Chart(pieChartContext, {
        type: 'pie',
        data: {
          labels: budgetData.map(item => item.title),
          datasets: [{
            data: budgetData.map(item => item.budget),
            backgroundColor: budgetData.map(item => item.color),
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Budget Distribution',
            },
          },
        },
      });
    }
  };
  
  
  

  const createDonutChart = (budgetData) => {
    const width = 450;
    const height = 450;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
  
    const svg = d3.select('#donutChart') // Select the SVG element with id 'donutChart'
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const color = d3.scaleOrdinal()
      .domain(budgetData.map((item) => item.title))
      .range(budgetData.map((item) => item.color));
  
    const pie = d3.pie()
      .sort(null)
      .value((d) => d.budget);
  
    const data_ready = pie(budgetData);
  
    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);
  
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
  
    svg.selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.title))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);
  
    svg.selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', function (d) {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.90 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });
  
    svg.selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d) => d.data.title)
      .attr('transform', function (d) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.90 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', function (d) {
        const midangle = d.startAngle + 2 * (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });
  };
  
 /* eslint-disable no-undef */
// eslint-disable-next-line
 const createBarChart = (budgetData) => {
  if (barChartRef.current && !barChartInstance) {
    const barChartContext = barChartRef.current.getContext('2d');
    // eslint-disable-next-line
    barChartInstance = new Chart(barChartContext, {
      type: 'bar',
      data: {
        labels: budgetData.map(item => item.title),
        datasets: [{
          label: 'Budget',
          data: budgetData.map(item => item.budget),
          backgroundColor: budgetData.map(item => item.color),
          borderColor: budgetData.map(item => item.color),
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Budget by Category',
          },
        },
      },
    });
  }
};



  
  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <main className="center" id="main">
      <div id="dashboard">
        <h1>Budget Dashboard</h1>
  
        <div id="budgetTableHolder">
          {budgetData.length === 0 ? (
            <p>You don't have any budget data yet! Get started by adding some budget data below.</p>
          ) : (
            <table id="budgetTable">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Budget</th>
                  <th>Color</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>${item.budget}</td>
                    <td>
                      <div style={{ width: `${item.budget}%`, backgroundColor: item.color }}></div>
                    </td>
                    <td style={{ color: item.color }}>{item.color}</td>
                    <td>
                      <button onClick={() => deleteFromBudget(item.title)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
  
        <div>
          <h2>Add to Budget</h2>
          <div id="addToBudget">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => handleInputChange(e, setTitle)}
            />
            <input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => handleInputChange(e, setBudget)}
            />
            <input
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => handleInputChange(e, setColor)}
            />
            <button onClick={addToBudget}>Add</button>
          </div>
        </div>
  
        <div>
          <p id="errorMessage">{errorMessage}</p>
        </div>
  
        <div id="pieChartHolder">
          <h2>Pie Chart</h2>
          <canvas id="pieChart" ref={pieChartRef} width="200" height="200"></canvas>
        </div>
  
        <div id="barChartHolder">
  <h2>Bar Chart</h2>
  <canvas ref={barChartRef}></canvas>
  <div id="donutChartHolder">
  <h2>Donut Chart</h2>
  <div id="donutChart"></div> {/* Create a div for the D3.js chart */}
</div>

  <h2>Budget Settings</h2>
  <div id="budgetSettings">
    {/* Input field for updating savings */}
    <input
      type="number"
      placeholder="Savings"
      value={savings}
      onChange={(e) => handleInputChange(e, setSavings)}
    />
    
    {/* Button to trigger the savings update */}
    <button onClick={updateSavings}>Update Savings</button>
    {/* Input field for updating income */}
    <input
      type="number"
      placeholder="Income"
      value={income}
      onChange={(e) => handleInputChange(e, setIncome)}
    />
    
    {/* Button to trigger the income update */}
    <button onClick={updateIncome}>Update Income</button>
  
  </div>
</div>

      </div>
    </main>
  );
  
}

export default Dashboard;
  
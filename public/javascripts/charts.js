async function renderOverTimeGraph(email) {
  const response = await fetch(`/api/${email}`);
  const json = await response.json();
  console.log(json);
  const lineLabels = json.monthlyCommits.map(d => d.yyyymm);
  const lineData = json.monthlyCommits.map(d => d.total_commits);
  const commitsChart = document.getElementById('commitsChart');

  new Chart(commitsChart, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [{
        label: 'Commits over time',
        data: lineData,
        borderColor: '#36A2EB',
        backgroundColor: '#abcfe8',
      }],
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: 'Monthly commits over time'
      }
    },
  });

  const doughnutLabels = Object.keys(json.locStats);
  const doughnutData = Object.values(json.locStats);
  const locChart = document.getElementById('locChart');
  new Chart(locChart, {
    type: 'doughnut',
    data: {
      labels: doughnutLabels,
      datasets: [{
        label: 'LOC distribution',
        data: doughnutData,
        backgroundColor: [
          '#2096F3', // CSS
          '#4A3860', // ELIXIR
          '#EB7847', // Java
          '#F7E046', // JS
          '#1D365D', // Less
          '#93232B', // Ruby
          '#D278A5', // Scss
          '#0079CC', // TS
        ],
      }],
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: 'Total LOC per language'
      }
    },
  });
}
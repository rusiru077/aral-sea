/* charts.js: Chart.js grafici Mar d'Aral */

document.addEventListener('DOMContentLoaded', () => {
  Chart.defaults.color = '#8a9ab0';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

  initSurfaceChart();
  initSalinityChart();
});

function initSurfaceChart() {
  const ctx = document.getElementById('surfaceChart');
  if (!ctx) return;

  // Gradient
  const chart = ctx.getContext('2d');
  const gradient = chart.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, 'rgba(26, 107, 154, 0.5)');
  gradient.addColorStop(0.6, 'rgba(200, 146, 42, 0.15)');
  gradient.addColorStop(1, 'rgba(201, 64, 64, 0.0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [1960, 1971, 1976, 1989, 2005, 2009, 2011, 2018],
      datasets: [{
        label: 'Superficie (km²)',
        data: [67499, 60200, 55700, 39734, 17382, 8409, 12014, 8322],
        borderColor: function(context) {
          const chart = context.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return '#1a6b9a';
          const gradient = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, '#1a6b9a');
          gradient.addColorStop(0.6, '#c8922a');
          gradient.addColorStop(1, '#c94040');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        backgroundColor: gradient,
        tension: 0.35,
        pointBackgroundColor: '#c8922a',
        pointBorderColor: '#c8922a',
        pointRadius: 5,
        pointHoverRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f1620',
          borderColor: 'rgba(200,146,42,0.3)',
          borderWidth: 1,
          titleColor: '#e8b86d',
          bodyColor: '#e8ddd0',
          callbacks: {
            label: ctx => ` ${ctx.parsed.y.toLocaleString('it-IT')} km²`,
            afterLabel: ctx => {
              const pct = Math.round((ctx.parsed.y / 67499) * 100);
              return ` ${pct}% del 1960`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8a9ab0' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#8a9ab0',
            callback: v => v.toLocaleString('it-IT') + ' km²'
          },
          min: 0,
          suggestedMax: 72000
        }
      }
    }
  });
}

function initSalinityChart() {
  const ctx = document.getElementById('salinityChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s'],
      datasets: [
        {
          label: 'Piccolo Aral (Nord)',
          data: [10, 14, 25, 12, 12, 12],
          backgroundColor: 'rgba(42, 143, 196, 0.75)',
          borderColor: '#2a8fc4',
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: 'Grande Aral (Sud)',
          data: [10, 14, 30, 65, 130, 170],
          backgroundColor: 'rgba(201, 64, 64, 0.65)',
          borderColor: '#c94040',
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: 'Mare normale (riferimento)',
          data: [35, 35, 35, 35, 35, 35],
          type: 'line',
          borderColor: 'rgba(232, 184, 109, 0.5)',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#8a9ab0',
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#0f1620',
          borderColor: 'rgba(200,146,42,0.3)',
          borderWidth: 1,
          titleColor: '#e8b86d',
          bodyColor: '#e8ddd0',
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} g/L`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8a9ab0' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#8a9ab0',
            callback: v => v + ' g/L'
          },
          min: 0,
          suggestedMax: 180
        }
      }
    }
  });
}

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function CompletionChart({ reports }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tasks Completion By Customer',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart',
        },
    };

    const labels = reports.map(r => r.name);

    const data = {
        labels,
        datasets: [
            {
                label: 'Total Tasks',
                data: reports.map(r => r.total_tasks),
                backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo-500
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Completed Tasks',
                data: reports.map(r => r.completed_tasks),
                backgroundColor: 'rgba(52, 211, 153, 0.7)', // Emerald-400
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    return (
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <Bar options={options} data={data} height={100} />
        </div>
    );
}

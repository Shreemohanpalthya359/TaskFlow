import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CustomerD3Graph({ reports }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!reports || reports.length === 0) return;

        // Clear old SVG
        d3.select(svgRef.current).selectAll('*').remove();

        const width = 600;
        const height = 400;

        const svg = d3
            .select(svgRef.current)
            .attr('width', '100%')
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

        // Prepare node data
        const nodes = reports.map(r => ({
            id: r.name,
            radius: Math.max(20, Math.min(80, r.total_tasks * 5 + 20)),
            total: r.total_tasks,
            completed: r.completed_tasks,
        }));

        // Create a simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(10))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(d => d.radius + 2).iterations(2));

        // Create a color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const nodeGroup = svg
            .selectAll('g')
            .data(nodes)
            .join('g')
            .call(drag(simulation));

        // Outer circle (Total)
        nodeGroup
            .append('circle')
            .attr('r', d => d.radius)
            .attr('fill', (d, i) => color(i))
            .attr('opacity', 0.6)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Inner circle (Completed ratio)
        nodeGroup
            .append('circle')
            .attr('r', d => (d.total > 0 ? (d.completed / d.total) * d.radius : 0))
            .attr('fill', '#10b981') // emerald color mapping to completed
            .attr('opacity', 0.9);

        nodeGroup
            .append('text')
            .text(d => d.id)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .attr('fill', '#fff')
            .style('font-size', d => Math.min(14, d.radius / 2) + 'px')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none');

        // Tooltip
        nodeGroup.append('title').text(d => `${d.id}\nTasks: ${d.completed}/${d.total}`);

        simulation.on('tick', () => {
            nodeGroup.attr('transform', d => {
                // Keep within bounds
                d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                return `translate(${d.x},${d.y})`;
            });
        });

        // Drag interactions
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3
                .drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [reports]);

    return (
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 w-full text-center">Interactive Customer Load (D3.js)</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">Outer circle represents total tasks. Green inner circle represents completed tasks. Drag nodes to interact.</p>
            <svg ref={svgRef}></svg>
        </div>
    );
}

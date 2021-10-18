import { useState, useEffect } from 'react';
import './App.scss';
import * as d3 from 'd3';

function App() {
  const [gameData, setGameData] = useState([])

  let colors = {
    'Wii': '#4A658B',
    'DS': '#A5B2C5',
    'X360':'#4E9B47',
    'GB': '#A7CDA3',
    'PS3':'#D94D55',
    'NES':'#ECA6AA',
    'PS2':'#FFDF33',
    '3DS':'#FFEF99',
    'PS4':'#95D1D7',
    'SNES':'#CAE8EB',
    'PS':'#8C547C',
    'N64':'#C5A9BD',
    'GBA':'#FFAD33',
    'XB':'#FFD699',
    'PC':'#869C5D',
    '2600':'#C3CDAE',
    'PSP':'#C7B8B8',
    'XOne':'#FBEEEE'
  }

  let gameDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

  useEffect(() => {
    async function fetchData() {
      let response = await fetch(gameDataUrl)
      let data = await response.json()
      setGameData(data)
      console.log(data)
    }
    fetchData()
  }, [gameDataUrl])

  let canvas = d3.select('#canvas')

  let tooltip = d3.select('#tooltip')

  const drawTreemap = () => {
    let hierarchy = d3.hierarchy(gameData, (node) => node['children'])
                      .sum((node) => node['value'])
                      .sort((node1, node2) => node2['value'] - node1['value']);

    let createTreemap = d3.treemap()
                          .size([1000, 600])

    createTreemap(hierarchy)      
    
    let gameTiles = hierarchy.leaves()
    console.log(gameTiles)
    
    let block = canvas.selectAll('g')
                      .data(gameTiles)
                      .enter()
                      .append('g')
                      .attr('transform', (d) => {
                        return 'translate(' + d['x0'] + ', ' + d['y0'] + ')'
                      })
                      
                      

    block.append('rect')
         .attr('class', 'tile')
         .attr('fill', (d) => {
           let category = d['data']['category']
            return colors[category]
         })
         .attr('data-name', (d) => d['data']['name'])
         .attr('data-category', (d) => d['data']['category'])
         .attr('data-value', (d) => d['data']['value'])
         .attr('width', (d) => d['x1'] - d['x0'] - 1)
         .attr('height', (d) => d['y1'] - d['y0'] -1)
         .on('mouseover', (d) => {
           tooltip.transition()
                  .duration(200)
                  .style('visibility', 'visible')

           tooltip.html('Name: ' + d['data']['name'] + '<br/>Category: ' + d['data']['category'] + '<br/>Value: ' + d['data']['value'])
           tooltip.style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 20 + "px")  

           tooltip.attr('data-value', d['data']['value'])
          })
         .on('mouseout', (d) => {
           tooltip.transition()
                  .duration(200)
                  .style('visibility', 'hidden')
         })
         
         
    block.append('foreignObject')
         .html((d) => {
           return '<div style="width: 45px; text-align:start; overflow-wrap: break-word;">' + d.data.name +'</div>'
          })
         .attr('x', 5)
         .attr('y', 5)
         .attr('width', 45)
         .attr('height', 100)
         .attr('class', 'game-name')
         .style('font-size', '0.5em')
         .style('font-weight', 700)
         .on('mouseover', (d) => {
          tooltip.transition()
                 .duration(200)
                 .style('visibility', 'visible')

          tooltip.html('Name: ' + d['data']['name'] + '<br/>Category: ' + d['data']['category'] + '<br/>Value: ' + d['data']['value'])
          tooltip.style("left", d3.event.pageX + 20 + "px")
                 .style("top", d3.event.pageY - 20 + "px")  

          tooltip.attr('data-value', d['data']['value'])
         })
        .on('mouseout', (d) => {
          tooltip.transition()
                 .duration(200)
                 .style('visibility', 'hidden')
        })       
  }

  useEffect(() => {
   drawTreemap()
  })

  return (
    <div className="App">
      <h1 id="title">Video Game Sales</h1>
      <h4 id="description">Top 100 Most Sold Video Games Grouped by Platform</h4>
      <svg id="canvas"></svg>
      <br />
      <svg id="legend">
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="20" fill={colors['Wii']}></rect>
          <text x="45" y="36">Wii</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="60" fill={colors['GB']}></rect>
          <text x="45" y="76">GB</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="100" fill={colors['PS2']}></rect>
          <text x="45" y="116">PS2</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="140" fill={colors['SNES']}></rect>
          <text x="45" y="156">SNES</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="180" fill={colors['GBA']}></rect>
          <text x="45" y="196">GBA</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="20" y="220" fill={colors['2600']}></rect>
          <text x="45" y="236">2600</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="20" fill={colors['DS']}></rect>
          <text x="145" y="36">DS</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="60" fill={colors['PS3']}></rect>
          <text x="145" y="76">PS3</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="100" fill={colors['3DS']}></rect>
          <text x="145" y="116">3DS</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="140" fill={colors['PS']}></rect>
          <text x="145" y="156">PS</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="180" fill={colors['XB']}></rect>
          <text x="145" y="196">XB</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="120" y="220" fill={colors['PSP']}></rect>
          <text x="145" y="236">PSP</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="20" fill={colors['X360']}></rect>
          <text x="245" y="36">X360</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="60" fill={colors['NES']}></rect>
          <text x="245" y="76">NES</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="100" fill={colors['PS4']}></rect>
          <text x="245" y="116">PS4</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="140" fill={colors['N64']}></rect>
          <text x="245" y="156">N64</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="180" fill={colors['PC']}></rect>
          <text x="245" y="196">PC</text>
        </g>
        <g>
          <rect class="legend-item" width="20" height="20" x="220" y="220" fill={colors['XOne']}></rect>
          <text x="245" y="236">X0ne</text>
        </g>
      </svg>
      <br/>
      <span id="da3ker">by da3ker</span>
      <div id="tooltip"></div>
    </div>
  );
}

export default App;

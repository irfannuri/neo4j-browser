/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component } from 'preact'
import {GraphComponent} from './Graph'
import neoGraphStyle from '../graphStyle'
import {InspectorComponent} from './Inspector'
import {LegendComponent} from './Legend'
import {StyledSvgWrapper, StyledFullSizeContainer} from './styled'

export class ExplorerComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.state.stats = {labels: {}, relTypes: {}}
    this.state.graphStyle = neoGraphStyle()
    if (this.props.graphStyleData) {
      this.state.graphStyle.loadRules(this.props.graphStyleData)
    }
    this.state.nodes = this.props.nodes
    if (this.props.nodes.length > parseInt(this.props.initialNodeDisplay)) {
      this.state.nodes = this.props.nodes.slice(0, this.props.initialNodeDisplay)
      this.state.selectedItem = {type: 'status-item', item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${this.props.initialNodeDisplay} of ${this.props.nodes.length} nodes are being displayed`}
    }
  }

  getNodeNeighbours (node, currentNeighbours, callback) {
    if (currentNeighbours.length > this.props.maxNeighbours) {
      callback({nodes: [], relationships: []})
    }
    this.props.getNeighbours(node.id, currentNeighbours).then((result) => {
      let nodes = result.nodes
      if (result.count > (this.props.maxNeighbours - currentNeighbours.length)) {
        nodes = result.nodes.slice(0, this.props.initialNodeDisplay)
        this.state.selectedItem = {type: 'status-item', item: `Rendering was limited to ${this.props.maxNeighbours} of the node's total ${result.count + currentNeighbours.length} neighbours due to browser config maxNeighbours.`}
      }
      callback({nodes: nodes, relationships: result.relationships})
    })
  }

  onItemMouseOver (item) {
    this.setState({hoveredItem: item})
  }

  onItemSelect (item) {
    this.setState({selectedItem: item})
  }

  onGraphModelChange (stats) {
    this.setState({stats: stats})
    this.props.updateStyle(this.state.graphStyle.toSheet())
  }

  onSelectedLabel (label, propertyKeys) {
    this.setState({selectedItem: {type: 'legend-item', item: {selectedLabel: {label: label, propertyKeys: propertyKeys}, selectedRelType: null}}})
  }

  onSelectedRelType (relType, propertyKeys) {
    this.setState({selectedItem: {type: 'legend-item', item: {selectedLabel: null, selectedRelType: {relType: relType, propertyKeys: propertyKeys}}}})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.graphStyleData !== this.props.graphStyleData && nextProps.graphStyleData) {
      this.state.graphStyle.loadRules(nextProps.graphStyleData)
      this.setState({graphStyle: this.state.graphStyle})
    }
  }

  render () {
    return (
      <StyledFullSizeContainer id='svg-vis' className={Object.keys(this.state.stats.relTypes).length ? '' : 'one-legend-row'}>
        <LegendComponent stats={this.state.stats} graphStyle={this.state.graphStyle} onSelectedLabel={this.onSelectedLabel.bind(this)} onSelectedRelType={this.onSelectedRelType.bind(this)} />
        <StyledSvgWrapper>
          <GraphComponent fullscreen={this.props.fullscreen} frameHeight={this.props.frameHeight} relationships={this.props.relationships} nodes={this.state.nodes} getNodeNeighbours={this.getNodeNeighbours.bind(this)} onItemMouseOver={this.onItemMouseOver.bind(this)} onItemSelect={this.onItemSelect.bind(this)} graphStyle={this.state.graphStyle} onGraphModelChange={this.onGraphModelChange.bind(this)} />
        </StyledSvgWrapper>
        <InspectorComponent hoveredItem={this.state.hoveredItem} selectedItem={this.state.selectedItem} graphStyle={this.state.graphStyle} />
      </StyledFullSizeContainer>
    )
  }
}
export const Explorer = ExplorerComponent

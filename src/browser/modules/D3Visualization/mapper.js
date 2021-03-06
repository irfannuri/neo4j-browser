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

export function createGraph (nodes, relationships) {
  let graph = new neo.models.Graph()
  graph.addNodes(mapNodes(nodes))
  graph.addRelationships(mapRelationships(relationships, graph))
  graph.display = { initialNodeDisplay: 300, nodeCount: 1 }
  return graph
}

export function mapNodes (nodes) {
  return nodes.map((node) => new neo.models.Node(node.id, node.labels, node.properties))
}

export function mapRelationships (relationships, graph) {
  return relationships.map((rel) => {
    const source = graph.findNode(rel.startNodeId)
    const target = graph.findNode(rel.endNodeId)
    return new neo.models.Relationship(rel.id, source, target, rel.type, rel.properties)
  })
}

export function getGraphStats (graph) {
  let labelStats = {}
  let relTypeStats = {}
  graph.nodes().forEach((node) => {
    node.labels.forEach((label) => {
      if (labelStats[label]) {
        labelStats[label].count = labelStats[label].count + 1
        labelStats[label].properties = Object.assign({}, labelStats[label].properties, node.propertyMap)
      } else {
        labelStats[label] = {
          count: 1,
          properties: node.propertyMap
        }
      }
    })
  })
  graph.relationships().forEach((rel) => {
    if (relTypeStats[rel.type]) {
      relTypeStats[rel.type].count = relTypeStats[rel.type].count + 1
      relTypeStats[rel.type].properties = Object.assign({}, relTypeStats[rel.type].properties, rel.propertyMap)
    } else {
      relTypeStats[rel.type] = {
        count: 1,
        properties: rel.propertyMap
      }
    }
  })
  return {labels: labelStats, relTypes: relTypeStats}
}

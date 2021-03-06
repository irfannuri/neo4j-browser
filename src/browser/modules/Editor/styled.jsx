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

import styled from 'styled-components'
import { dim } from 'browser-styles/constants'

export const Bar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: middle;
  min-height: ${dim.editorbarHeight}px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);
  `
export const ActionButtonSection = styled.div`
  flex: 0 0 130px;
  align-items: center;
  display: flex;
  justify-content: space-around;
  background-color: ${props => props.theme.editorBarBackground};
`

export const EditorWrapper = styled.div`
  flex: auto;
  padding: 12px 12px 12px 12px;
  background-color: ${props => props.theme.editorBarBackground};
  font-family: Monaco,"Courier New",Terminal,monospace;
`

from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

class Attribute(BaseModel):
    name: str
    datatype: str
    size: int | None = None
    isPrimaryKey: bool = False
    isPrimaryAttribute: bool = False
    isDiscriminator: bool = False

class Position(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    Title: str
    Attributes: list[Attribute] = Field(default_factory=list)

class Measured(BaseModel):
    width: float
    height: float

class Node(BaseModel):
    id: str
    position: Position
    data: NodeData
    type: Literal["strongEntity", "weakEntity", "strongRelation", "weakRelation"]
    measured: Measured
    selected: bool = False
    dragging: bool = False

class Edge(BaseModel):
    id: str
    source: str
    target: str
    cardinality: Literal["1-1", "1-N", "N-M"] | None = None

class ProjectData(BaseModel):
    nodes: list[Node] = Field(default_factory=list)
    edges: list[Edge] = Field(default_factory=list)

class Project(BaseModel):
    title: str = "Untitled"
    group: str = "Personal"
    created_by: str
    created_at: datetime
    last_modified_at: datetime
    last_modified_by: str
    data: ProjectData = Field(default_factory=ProjectData)

import { gql } from "apollo-server";

// Schema
const typeDefs = gql`

  #*********** PARA EL VENDEDOR **********#

  type Vendedor {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  input VendedorInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  #*********** PARA EL PRODUCTO **********#

  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
  }

  
  #*********** PARA EL CLIENTE **********#

  type Cliente {
    id: ID
    nombre: String
    apellido: String
    empresa: String
    email: String
    telefono: String
    vendedor: ID
  }
  
  input ClienteInput {
    nombre: String!
    apellido: String!
    empresa: String!
    email: String!
    telefono: String
  }
  

  # ************** QUERYS *****************#

  type Query {
    # Vendedor
    obtenerVendedor: Vendedor
    obtenerVendedores: [Vendedor]

    # Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!) : Producto
  }
  

  # ************** MUTATION *****************#
  # Editar, crear y eliminar van en los mutation
  type Mutation {
    # Vendedor
    nuevoVendedor(input: VendedorInput): Vendedor
    autenticarVendedor(input: AutenticarInput): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String

    # Clientes
    nuevoCliente(input: ClienteInput): Cliente
    actualizarCliente(id: ID!, input: ClienteInput): Cliente
    eliminarCliente(id: ID!): String
  }

`;

module.exports = typeDefs;
import Vendedores from "../models/Vendedores";
import Producto from "../models/Producto";
import Cliente from "../models/Clientes";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config({ path: "variables.env" });
// el de arriba para verificar y firmar el token tiene que ser la misma: SECRETAR

const crearToken = (vendedor, secreta, expiresIn) => {
  // console.log(vendedor);
  const { id, email, nombre, apellido } = vendedor;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

const resolvers = {
  Query: {
    // ! Vendedor **************
    obtenerVendedor: async (_, {}, ctx) => {
      return ctx.vendedor;
    },
    obtenerVendedores: async () => {
      try {
        const vendedores = await Vendedores.find({});
        return vendedores;
      } catch (error) {
        console.log(error);
      }
    },

    // ! Productos ***************
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      // Revisar si el producto existe o no
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Sí, es un ObjectId válido, proceda con la llamada `findById`.
        const producto = await Producto.findById(id);
        return producto;
      } else {
        throw new Error('Producto no encontrado');
      }
    },
  },

  Mutation: {
    // ! VENDEDORES
    // * Crear nuevo vendedor
    nuevoVendedor: async (_, { input }) => {
      const { email, password } = input;

      // Revisamos si el vendedor ya está registrado
      const existeVendedor = await Vendedores.findOne({ email });
      if (existeVendedor) {
        throw new Error("El usuario ya está registrado");
      }

      // Hashear su password
      const salt = await bcryptjs.genSaltSync(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // Guardar en la base de datos
        const vendedor = new Vendedores(input);
        vendedor.save();
        return vendedor;
      } catch (error) {
        console.log(error);
      }
    },

    //* Autenticar vendedor
    autenticarVendedor: async (_, { input }) => {
      const { email, password } = input;

      // Si el cliente no existe
      const existeVendedor = await Vendedores.findOne({ email });
      if (!existeVendedor) {
        throw new Error("El usuario no existe");
      }

      // Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeVendedor.password
      );
      if (!passwordCorrecto) {
        throw new Error("El password es incorrecto");
      }

      // Crear el token
      return {
        token: crearToken(existeVendedor, process.env.SECRETA, "24h"),
      };
    },

    // ! PRODUCTOS
    // * Crear nuevo producto
    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    // * Actualizar producto
    actualizarProducto: async (_, { id, input }) => {
      // REvisar si el producto existe o no
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Si es un objectId valido, procede con la llmada 'findById
        let producto = await Producto.findById(id);
        // ? guardarlo en la base de datos
        // ? id, lo que actualiza y dare true
        producto = await Producto.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return producto;
      } else {
        throw new Error("Producto no encontrado");
      }
    },

    // * Eliminar producto
    eliminarProducto: async (_, { id }) => {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // eliminamos
        await Producto.findOneAndDelete({ _id: id });
        return "Producto eliminado";
      } else {
        throw new Error("Producto no encontrado");
      }
    },

    // ! CLIENTES
    // * Crear nuevo cliente
    nuevoCliente: async (_, {input}, ctx) => {
      console.log(ctx);

      const {email} = input;
      // Verificar si el email ya está registrado
      const cliente = await Cliente.findOne({email});
      if(cliente) {
        throw new Error('El cliente ya está registrado');
      }

      const nuevoCliente = new Cliente(input);
      // Asignar el vendedor
      nuevoCliente.vendedor = ctx.vendedor.id;

      // Guardarlo en la base de datos
      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    // * Actualizar cliente
    actualizarCliente: async (_, {id, input}, ctx) => {
      // Verificar si existe o no
      if(id.match(/^[0-9a-fA-F]{24}$/)) {
        let cliente = await Cliente.findById(id);

        // Verificar si el vendedor es quien edita
        if(cliente.vendedor.toString() !== ctx.vendedor.id) {
          throw new Error('No tienes las credenciales');
        }

        // Guardar el cliente
        cliente = await Cliente.findOneAndUpdate({_id: id}, input, {
          new: true,
        });
        return cliente;
      } else {
        throw new Error('Ese cliente no existe');
      }
    },

    // * Eliminar Cliente
    eliminarCliente: async (_, {id} , ctx) => {
      // Verificar si existe o no
      if (id.match(/^[0-9a-fA-F]{24}$/))  {
        let cliente = await Cliente.findById(id);

        // Verificar si es el vendedor quien elimina
        if(cliente.vendedor.toString() !== ctx.vendedor.id) {
          throw new Error('No tiene las credenciales');
        }

        // Eliminar cliente
        await Cliente.findOneAndDelete({_id: id});
        return 'Cliente eliminado';
      } else {
        throw new Error('Ese cliente no existe');
      }
    },
    
    // ! PEDIDO

  },
};

module.exports = resolvers;

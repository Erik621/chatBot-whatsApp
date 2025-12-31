import { AppDataSource } from '../../../../db/data-source';
import { Cliente } from '../../../../db/entities/interface/pedido/Cliente';
import { Pedido } from '../../../../db/entities/interface/pedido/Pedido';
import { PedidoItem } from '../../../../db/entities/interface/pedido/PedidoItem';
import { PedidoIngrediente } from '../../../../db/entities/interface/pedido/PedidoIngrediente';
import { Pagamento } from '../../../../db/entities/interface/pedido/Pagamento';

// Já existentes
import { User } from '../../../../db/entities/interface/User';
import { Categoria } from '../../../../db/entities/interface/Categoria';
import { Produto } from '../../../../db/entities/interface/Produto';
import { Ingrediente } from '../../../../db/entities/interface/Ingrediente';
import { WhatsappContato } from '../../../../db/entities/interface/WhatsappContato';

export const UserRepository = AppDataSource.getRepository(User);
export const CategoriaRepository = AppDataSource.getRepository(Categoria);
export const ProdutoRepository = AppDataSource.getRepository(Produto);
export const IngredienteRepository = AppDataSource.getRepository(Ingrediente);

// Novos
export const ClienteRepository = AppDataSource.getRepository(Cliente);
export const PedidoRepository = AppDataSource.getRepository(Pedido);
export const PedidoItemRepository = AppDataSource.getRepository(PedidoItem);
export const PedidoIngredienteRepository = AppDataSource.getRepository(PedidoIngrediente);
export const PagamentoRepository = AppDataSource.getRepository(Pagamento);
export const WhatsappContatoRepository = AppDataSource.getRepository(WhatsappContato);

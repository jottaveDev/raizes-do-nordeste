import { Link } from 'react-router-dom'
import Botao from '../components/ui/Botao'
import Card from '../components/ui/Card'

const secoes = [
  {
    titulo: '1. Quais dados coletamos',
    itens: [
      'Nome, e-mail e telefone, informados no cadastro e no checkout.',
      'Histórico de pedidos, unidade escolhida, itens e valores.',
      'Pontos de fidelidade e histórico de movimentações.',
      'Consentimentos de privacidade e de marketing.',
    ],
  },
  {
    titulo: '2. Para que usamos os dados',
    itens: [
      'Criar e autenticar sua conta.',
      'Processar o pedido e permitir o acompanhamento do preparo.',
      'Creditar pontos e aplicar benefícios de fidelidade.',
      'Enviar promoções apenas se você autorizar o marketing.',
      'Cumprir obrigações legais e de auditoria.',
    ],
  },
  {
    titulo: '3. Compartilhamento',
    itens: [
      'O pagamento é delegado a um serviço externo; este protótipo não envia dados reais.',
      'Não vendemos dados pessoais.',
      'Em produção, o compartilhamento deve seguir a finalidade informada e a LGPD.',
    ],
  },
  {
    titulo: '4. Seus direitos',
    itens: [
      'Confirmar a existência de tratamento e acessar seus dados.',
      'Corrigir dados incompletos ou desatualizados.',
      'Revogar o consentimento de marketing.',
      'Solicitar a exclusão dos dados.',
      'Obter informações sobre compartilhamento e retenção.',
    ],
  },
  {
    titulo: '5. Armazenamento e segurança',
    itens: [
      'Neste protótipo, os dados ficam no localStorage do navegador.',
      'Nenhuma senha é enviada para servidores; o login é simulado.',
      'Em produção, são necessários criptografia, controle de acesso e auditoria.',
    ],
  },
]

export default function Lgpd() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-marrom">Política de Privacidade</h1>
      <p className="mt-1 text-sm text-marrom-claro">
        Última atualização: novembro de 2026. Documento acadêmico do projeto Raízes do
        Nordeste.
      </p>

      <div className="mt-5 space-y-4">
        <Card>
          <p className="text-sm text-marrom-claro">
            A Raízes do Nordeste respeita a sua privacidade. Conhecer o cliente é importante,
            mas proteger os dados pessoais é obrigatório. Esta política explica o que
            coletamos, por quê e como você pode exercer seus direitos.
          </p>
        </Card>

        {secoes.map((secao) => (
          <Card key={secao.titulo}>
            <h2 className="text-lg font-bold text-marrom">{secao.titulo}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-marrom-claro">
              {secao.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}

        <Card>
          <h2 className="text-lg font-bold text-marrom">6. Como exercer seus direitos</h2>
          <p className="mt-2 text-sm text-marrom-claro">
            Acesse a página{' '}
            <Link to="/perfil" className="font-semibold text-terracota underline">
              Meu perfil
            </Link>{' '}
            para corrigir dados, alterar consentimentos ou solicitar a exclusão. Em um
            cenário real, o pedido também pode ser feito pelo canal do encarregado de dados.
          </p>
          <p className="mt-2 text-sm text-marrom-claro">
            Contato fictício do encarregado: privacidade@raizesdonordeste.example
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-marrom">7. Cookies e armazenamento local</h2>
          <p className="mt-2 text-sm text-marrom-claro">
            Usamos o armazenamento local do navegador para manter sessão, carrinho,
            preferência de canal e consentimento de cookies. Não há rastreamento de
            terceiros neste protótipo.
          </p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Botao para="/">Voltar ao início</Botao>
        <Botao para="/perfil" variante="contorno">
          Gerenciar meus dados
        </Botao>
      </div>
    </div>
  )
}

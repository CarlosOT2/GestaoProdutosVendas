//# Componentes //
import TxtPadrão from '../Miscellaneous/TxtPadrão.js'
//# Classes //
import './PaginationComponent.scss'

//# Exportações // 
export default function PaginationComponent({ config_pagination }) {
    const { req_pagination, visible, url } = config_pagination
    return (
        <div className='pagination-control'>
            {visible ?
                <>
                    <button
                        className='pagination-control__button'
                        onClick={() => req_pagination(url, true)}
                    >
                        <TxtPadrão
                            texto={'CARREGAR MAIS'}
                            type={'span'}
                            style={{ cursor: 'pointer' }}
                        />
                    </button>
                </>
                :
                <></>
            }
        </div>

    )
}

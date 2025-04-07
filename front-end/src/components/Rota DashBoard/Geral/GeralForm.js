//# Componentes //
import InputDate from '../../Componentes Globais/Inputs/InputDate'
import InputField from '../../Componentes Globais/Inputs/InputField'
import Btn from '../../Componentes Globais/Inputs/Button'
//# Libs //
import InputsControl from "../../../helpers/js/InputsControl"
//# Classes //
import './GeralForm.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';

export default function GeralForm({ req_dashboard, filter, className }) {

    //# InputsFields //
    const Inputs = [
        {
            name: 'previous_date',
            placeholder: '2022/10/27',
            labelText: 'Data'
        },
        {
            name: 'current_date',
            placeholder: '2024/10/27',
        },
        {
            name: 'limit',
            placeholder: '15',
            step: 1,
            center: true,
            labelText: 'Limite'
        }
    ]
    //# InputsControl //
    const { onSubmit, inputsController } = InputsControl(
        {
            inputsFields: Inputs,
            submitFunction: async (inputsData) => {
                const { previous_date, current_date, limit } = inputsData
                req_dashboard({
                    lucro_maior: true,
                    lucro_menor: true,
                    previous_date,
                    current_date,
                    limit
                })
            }
        }
    )
    //# Filters //
    const Limite = filter.products.filter_inputs['Limite']
    const Data = filter.products.filter_inputs['Data']

    return (
        <>
            <form className={frmt(`
                form-GeralDshB
                ${className || ''}
                `)}
                onSubmit={onSubmit}
            >
                {Limite &&
                    <>
                        <InputField
                            type='number'
                            id='limit'
                            inputsController={inputsController}
                        />
                    </>
                }
                {Data &&
                    <>
                        <InputDate
                            id='previous_date'
                            inputsController={inputsController}
                        />
                        <InputDate
                            id='current_date'
                            inputsController={inputsController}
                        />
                    </>
                }
                {(Limite || Data) &&
                    <Btn type='submit' value='Confirmar' />
                }
            </form>
        </>
    )
}
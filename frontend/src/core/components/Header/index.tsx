import './styles.scss';
import { default as embrapa } from 'core/assets/images/embrapa.svg';
import { default as ufrr } from 'core/assets/images/ufrr.svg';

interface Props {
    title: { name: string, period?: string };
    showLogos?: boolean;
    menuState?: boolean;
    onChangeMenuState?: (state: boolean) => void;
}

const Header = ({ title, showLogos }: Props) => {
    return (
        <div className={showLogos ? 'header-login' : 'header-container'}>
            <h3 className="d-flex align-items-center app-title mb-0 ps-3 pe-2 pe-md-3">avadec</h3>
            <div className="d-flex align-items-center fs-2 material-icons">arrow_right</div>
            <div className="d-flex align-items-center justify-content-between w-100">
                {
                    showLogos && (
                        <div className="w-25">
                            <img src={embrapa} className="mw-100" alt="" />
                        </div>
                    )
                }
                <div className='d-flex flex-wrap justify-content-center align-items-center px-md-3 px-2'>
                    <h1 className="mb-0 header-title text-nowrap">{title.name}</h1>
                    {
                        title.period && (
                            <p className="ps-1 mb-0 header-period text-nowrap">
                                {'(' + title.period + ')'}
                            </p>
                        )
                    }
                </div>
                {
                    showLogos && (
                        <div className="w-25">
                            <img src={ufrr} alt="" />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Header;

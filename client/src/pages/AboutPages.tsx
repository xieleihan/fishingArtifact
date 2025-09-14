import '../styles/AboutPages.scss';
import Logo from '../assets/icon/nodata-search.svg';

function AboutPages() {
    return (
        <>
            <section className="aboutPages">
                <div className="top">
                    <img className='logoIcon' loading='lazy' src={Logo} alt="Logo" />
                    <span className='name'>Fishing Artifact</span>
                </div>
            </section>
        </>
    )
}

export default AboutPages;
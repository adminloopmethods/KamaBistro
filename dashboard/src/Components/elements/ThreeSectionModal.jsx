import Section from "./Section";

const ThreeSectionModal = ({ element }) => {

    return (
        <section id={element.id}>
            <Section />
            <Section />
            <Section />
        </section>
    )
}

export default ThreeSectionModal
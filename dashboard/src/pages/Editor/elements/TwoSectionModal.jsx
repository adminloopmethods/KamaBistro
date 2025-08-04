import Section from "./Section";

const TwoSectionModal = ({ element }) => {

    return (
        <section id={element.id}>
            <Section />
            <Section />
        </section>
    )
}

export default TwoSectionModal
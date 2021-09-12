import TopicCard from './TopicCard'; 
import classes from './TopicCardContainer.module.scss';
import Topic from '../models/Topic';

export default function TopicCardContainer(props: {topics: Topic[]}) {
    return (
        <section className={classes.topicCardContainer}>
        {props.topics.map((topicCard) => (
                <TopicCard
                    key={topicCard.id}
                    id={topicCard.id}
                    image={topicCard.image}
                    imageAlt={topicCard.imageAlt}
                    link={topicCard.link}
                    buttonText={topicCard.buttonText}
                />
            ))}
        </section>
    )
}
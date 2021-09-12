import Image from 'next/image';
import Topic from '../models/Topic';
import ButtonPrimary from './ButtonPrimary';
import classes from './TopicCard.module.scss';

export default function TopicCard(props: Topic) {
    return (
        <div className={classes.topicCard}>
            <Image src={props.image} 
                width="220" 
                height="220" 
                alt={props.imageAlt} />
            <ButtonPrimary 
                link={props.link}
                caption={props.buttonText} />
        </div>
    )
}
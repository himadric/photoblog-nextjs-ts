import Message from '../models/Message';
import classes from './MessageBlock.module.scss';

export default function MessageBlock(props: Message) {
    return (
        <section className={classes.message}>
            <h1>{props.title}</h1>
            <p>
                <div dangerouslySetInnerHTML={{ __html: props.body}} />
            </p>
        </section>
    )
}
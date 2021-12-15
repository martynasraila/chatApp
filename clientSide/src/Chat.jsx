import React from "react";

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql,
	useApolloClient,
} from "@apollo/client";

import styles from "./Chat.module.css"; // Import css modules stylesheet as styles

const client = new ApolloClient({
	uri: "http://localhost:4000/",
	cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
	query {
		messages {
			id
			content
			user
		}
	}
`;

const Messages = ({ user }) => {
	const data = useQuery(GET_MESSAGES).data;
	if (!data) {
		return null;
	}

	return (
		<>
			{data.messages.map(({ id, user: messageUser, content }) => {
				return (
					<div
						className={
							styles["message-box"] +
							" " +
							(messageUser == user ? styles.mine : styles.other)
						}
					>
                        {/* style the message depending if its the current user */}
						<div
							className={
								styles["message-text"] +
								" " +
								(messageUser == user
									? styles["message-mine"]
									: styles["message-other"])
							}
						>
							{content}
						</div>
						<div className={styles.avatar}>
							{messageUser.slice(0, 3).toUpperCase()}
						</div>
					</div>
				);
			})}
		</>
	);
};

const Chat = () => {
	return (
		<div className={styles["chat-container"]}>
			{/* display chat messages */}
			<Messages user={state.user} />
		</div>
	);
};

export default () => (
	<ApolloProvider client={client}>
		<Chat />
	</ApolloProvider>
);

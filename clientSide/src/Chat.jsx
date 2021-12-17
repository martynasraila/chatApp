import React from "react";

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql,
	useApolloClient,
	useMutation,
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

const ADD_MESSAGE = gql`
	mutation ($user: String!, $content: String!) {
		postMessage(user: $user, content: $content)
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
	const [state, setState] = React.useState({
		user: "",
		content: "",
	});
	const [addMessage] = useMutation(ADD_MESSAGE);

	const onSend = (e) => {
		e.preventDefault();
		if (state.content.length > 0) {
			console.log("Adding message");
			addMessage({ variables: state });
		}

		setState({ ...state, content: "" });
	};
	return (
		<div className={styles["chat-container"]}>
			{/* display chat messages */}
			<Messages user={state.user} />
			<form
				onSubmit={(e) => {
					onSend;
				}}
			>
				{/* input of username*/}
				<input
					type="text"
					className={styles.username}
					placeholder="UserName"
					value={state.user}
					onChange={(e) => setState({ ...state, user: e.target.value })}
				/>
				{/* input of message */}
				<input
					type="text"
					placeholder="Message"
					className={styles.message}
					value={state.content}
					onChange={(e) => setState({ ...state, content: e.target.value })}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							onSend;
						}
					}}
				/>
				{/* submit(send) button */}
				<button type="submit" onClick={onSend}>
					<img src="https://img.icons8.com/ios-glyphs/30/000000/sent.png" />
				</button>
			</form>
		</div>
	);
};

export default () => (
	<ApolloProvider client={client}>
		<Chat />
	</ApolloProvider>
);

BEGIN;

DROP TABLE IF EXISTS favorites, needs, projects, users;

CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar TEXT NULL,
    activated BOOLEAN DEFAULT TRUE
);

CREATE TABLE projects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    lat FLOAT NOT NULL,
    long FLOAT NOT NULL,
    image TEXT NULL,
    file TEXT NULL,
    archived BOOLEAN DEFAULT FALSE,
    author INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE needs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE
);

COMMIT;

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: localhub
--

COPY public.users (id, created_at, updated_at, name, email, password, avatar, activated) FROM stdin;
1	2021-02-07 16:49:02.50037+00	2021-02-07 16:49:02.50037+00	Avenir	avenir@gmail.fr	$1$CYhZVjCS$FC/t/V.S0h1GyJYA2ktFb/	/avatars/157097fe-69f1-11eb-ab25-1de322efb115.png	t
3	2021-02-07 17:34:28.117889+00	2021-02-07 17:34:28.117889+00	Parent Saint Herblain	albert@albert.fr	$1$I31AzSbv$nSy7n5toW56bOQo8phEYZ.	/avatars/c713bf8a-696b-11eb-ab25-1de322efb115.jpg	t
4	2021-02-07 17:55:30.645597+00	2021-02-07 17:55:30.645597+00	julien	julien@dosiere	$1$6kD4dWkh$mEHbjbwx9N1dHfkbmQvwW/	\N	t
5	2021-02-08 08:03:46.147387+00	2021-02-08 08:03:46.147387+00	Lara	lara@lara	$1$/9LQbCjU$wgporb1DLBmQfzKPlXbhO0	\N	t
10	2021-02-08 08:43:04.007798+00	2021-02-08 08:43:04.007798+00	OTStrasbourg	OT@visitstrasbourg.fr/	$1$AqAaGkPo$ypl.nbCU19YtDCwO54FZT.	\N	t
6	2021-02-08 08:15:53.269821+00	2021-02-08 08:15:53.269821+00	samourai virtuel	hiro@protagoniste	$1$6a3uvdTM$8hKCiIb9rQiXPtEWiNP8g0	/avatars/139cf9bc-69f2-11eb-ab25-1de322efb115.jpeg	t
8	2021-02-08 08:36:48.265374+00	2021-02-08 08:36:48.265374+00	Amicale de Loire-Atlantique	amicale-la-hub@gmail.com	$1$.22v5MKj$WySQsXDThyMDIgJuxhGi41	/avatars/1159d10e-69eb-11eb-ab25-1de322efb115.jpg	t
14	2021-02-08 08:56:30.773393+00	2021-02-08 08:56:30.773393+00	Strasbourg Mag	strasbourg-mag@strasbourg	$1$0F7OP9r0$ss6xv7P43QRKfhu3Bcwvu/	/avatars/358b243c-69ec-11eb-ab25-1de322efb115.jpg	t
21	2021-02-08 09:38:31.880274+00	2021-02-08 09:38:31.880274+00	Amicale du Petit-Beurre	petitbeurre@petitbeurre	$1$nSBtiNHH$gIRps/LerN.HNgbDYfra.0	/avatars/400227d4-69f2-11eb-ab25-1de322efb115.jpg	t
15	2021-02-08 09:04:51.916354+00	2021-02-08 09:04:51.916354+00	Choucroute-man	choucroute@choucroute	$1$Zsyt3azy$uLhtlzhIciH5Fwojw1XnA.	/avatars/6f1f349e-69ed-11eb-ab25-1de322efb115.jpg	t
9	2021-02-08 08:37:32.433512+00	2021-02-08 08:37:32.433512+00	Docteur Alain Cision	Alain.cision@yeuh.com	$1$7a/a8aMa$82H/9pGEMDSucxzcKzTEm0	/avatars/ac477598-69ed-11eb-ab25-1de322efb115.PNG	t
17	2021-02-08 09:12:11.765801+00	2021-02-08 09:12:11.765801+00	Duchesse du comté nantais	duchesse@duchesse	$1$f65BbZ8d$uDiuNRItQVNLfFer0pff7.	/avatars/8d77b352-69ee-11eb-ab25-1de322efb115.jpg	t
19	2021-02-08 09:19:30.294199+00	2021-02-08 09:19:30.294199+00	Polka Party	polka.party@huhu.com	$1$vMVivq0B$TFJbW93cQilWgdOLgYSPA1	/avatars/8ff0d13e-69f0-11eb-ab25-1de322efb115.PNG	t
13	2021-02-08 08:52:03.988179+00	2021-02-08 08:52:03.988179+00	OTStrasbourg	OT@strasbourg.org	$1$Gqi.PBgS$8wucCiLm0QwkGYJCrCZDv/	/avatars/e5a3ce42-69f0-11eb-ab25-1de322efb115.jpg	t
16	2021-02-08 09:10:27.353324+00	2021-02-08 09:10:27.353324+00	service éducatif musée de strasbourg	service-educatif@strasbourg.org	$1$MT86XVL8$mlBDk9GUrYzoJSdyHJdT.0	/avatars/580c34b0-69f1-11eb-ab25-1de322efb115.jpg	t
12	2021-02-08 08:51:07.472929+00	2021-02-08 08:51:07.472929+00	Julien	julien@gmail.fr	$1$TCvpPic7$YmfoSBY19MXtLvKJNHEcz/	/avatars/93f5e248-6a17-11eb-ab25-1de322efb115.jpeg	t
2	2021-02-07 17:26:02.281612+00	2021-02-07 17:26:02.281612+00	InsertActiv	active@active.fr	$1$T435dhJ0$Bcb7NG6maGhQbYegpl.G9.	/avatars/b23fa37a-6a16-11eb-ab25-1de322efb115.jpg	t
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: localhub
--

COPY public.projects (id, created_at, updated_at, expiration_date, title, description, location, lat, long, image, file, archived, author) FROM stdin;
1	2021-02-07 16:58:46.993152+00	2021-02-07 16:58:46.993152+00	2021-08-07 00:00:00+00	Les petits lutins sont en scène !	L'association "Avenir" à le privilège d'organiser cette année encore une représentation audacieuse avec la troupe "Les petits lutins" de Sautron. Afin que la représentation puisse avoir lieu cette année, nous sommes à la recherche d'un local pour nos répétitions et une salle de représentation pouvant accueillir jusqu'à 150 personnes.	Sautron	47.2632611	-1.6683537	/project-images/02aa3674-6966-11eb-ab25-1de322efb115.jpg	\N	f	1
2	2021-02-07 17:17:03.728053+00	2021-02-07 17:17:03.728053+00	2021-06-30 00:00:00+00	Un potager pour vos enfants	L'association "Avenir" organise à destination des enfants le weekend découverte de la culture maraichère BIO "Tous une main verte!" pour Juillet 2021.\nNous cherchons un professionnel du maraichage à proximité (20km) de Couëron intéressé pour accueillir la manifestation et partager avec nous la passion de son métier.	Coueron	47.2115054	-1.7271466	/project-images/5b1772e8-6968-11eb-ab25-1de322efb115.jpg	\N	f	1
3	2021-02-07 17:29:47.068559+00	2021-02-07 17:29:47.068559+00	2021-05-03 00:00:00+00	Entreprise Insert Active - Chargé d'insertion	L'entreprise Insert Active est une entreprise ayant une finalité sociale et concourant à l'insertion sociale et professionnelle de personnes rencontrant des difficultés particulières. Nous recherchons actuellement activement une chargée d'insertion ayant 10 ans d'expérience dans le domaine.	Bouguenais	47.179301	-1.6233691	/project-images/45b8c2f6-696a-11eb-ab25-1de322efb115.jpg	\N	f	2
4	2021-02-07 17:38:54.432901+00	2021-02-07 17:38:54.432901+00	2021-02-24 00:00:00+00	L'ile du savoir - pédagogie alternative	L'école "L'île du savoir" en pédagogie bienveillante et en autogestion souhaites ouvrir ses portes pour la rentrée scolaire de septembre 2021. Pour réaliser ce projet une réunion de présentation du projet et de ses acteurs se tiendra ce mercredi 24 février à la salle beauvais à 19H.	Saint herblain	47.2233007	-1.6346964	/project-images/6345bf26-696b-11eb-ab25-1de322efb115.jpg	\N	f	3
5	2021-02-08 08:20:06.465941+00	2021-02-08 08:20:06.465941+00	2079-08-01 00:00:00+00	pulls en laine de moutons électriques	tricoter des pulls en laine de moutons électriques pour androïdes frileux	Ouessant	48.459343950000004	-5.090602243370328	/project-images/52342ed0-69e7-11eb-ab25-1de322efb115.jpeg	\N	f	6
7	2021-02-08 08:43:31.022377+00	2021-02-08 08:43:31.022377+00	2021-07-12 00:00:00+00	Flash mob pour le Voyage à Nantes 2021	Les temps étant ce qu'ils sont, rassemblons-nous joyeusement sur une musique dansante près de l'île aux Machines cet été !	rue Félibien Nantes	47.2208557	-1.5638287	/project-images/ea0864ea-69e9-11eb-ab25-1de322efb115.jpg	\N	f	8
10	2021-02-08 08:54:39.726658+00	2021-02-08 08:54:39.726658+00	2021-01-12 00:00:00+00	Marché de Noël virtuel	Les circonstances sanitaires ont imposé l'annulation du fameux marché de Noël. L'idée est de créer un site permettant aux visiteurs de déambuler de chez eux dans un vrai marché de Noël dans lequel des commerçant pourraient proposer leurs produits régionaux , et même y programmer de vraies animations accessibles en ligne !	place de la Cathédrale  STRASBOURG	48.58155505	7.750155620573363	/project-images/93675bbc-69eb-11eb-ab25-1de322efb115.jpg	\N	f	13
11	2021-02-08 08:59:17.185271+00	2021-02-08 08:59:17.185271+00	2021-10-18 00:00:00+00	Appel à témoignages	Nous recherchons des personnes fraîchement installées à Strasbourg pour un dossier spécial	Schiltigheim	48.6047148	7.7484488	/project-images/0f0faee0-69ec-11eb-ab25-1de322efb115.jpg	\N	f	14
13	2021-02-08 09:15:17.73613+00	2021-02-08 09:15:17.73613+00	2021-11-28 00:00:00+00	Rendons à la noblesse ses lettres de noblesse	Le péril de la noblesse est en marche depuis hélas bien longtemps, je voudrais lui redonner ses lettres de noblesse (une touche d'humour ne fait jamais de mal !)	Château des ducs de Bretagne	47.21609735	-1.5499958913608	/project-images/453c4db4-69ee-11eb-ab25-1de322efb115.jpg	\N	f	17
14	2021-02-08 09:17:47.755693+00	2021-02-08 09:17:47.755693+00	2021-02-08 00:00:00+00	Animations devant le musée d'art contemporain	Nous faisons  un appel à projets d'animations autour des oeuvres du musée, prenant place dans l'espace public, dans le respect des normes sanitaires, alors que le musée reste fermé. Nous souhaitons y associer les écoles d'art et les associations culturelles désireuses de participer à cette animation qui sera filmée et diffusée en direct sur les réseaux sociaux.	1, place Hans-Jean-Arp Strasbourg	48.5796286	7.7366112	/project-images/17bd7e52-69ef-11eb-ab25-1de322efb115.jpg	\N	f	16
19	2021-02-08 09:47:07.698644+00	2021-02-08 09:47:07.698644+00	2021-08-02 00:00:00+00	manucure sur pierre	Nettoyer les pieds de la statue du roi Gradlon.	place saint corentin Quimper	47.9957922	-4.1029868	/project-images/b34495c4-69f2-11eb-ab25-1de322efb115.jpg	\N	t	6
12	2021-02-08 09:06:46.745304+00	2021-02-08 09:06:46.745304+00	2021-08-03 00:00:00+00	Choucroute géante sur la place	L'hiver est rude, et on n'a jamais assez de saucisses	Jardin des deux rives, Strasbourg	48.56762785	7.800223286389858	/project-images/31a0198a-69ed-11eb-ab25-1de322efb115.jpg	\N	f	15
18	2021-02-08 09:40:36.367357+00	2021-02-08 09:40:36.367357+00	2021-02-08 00:00:00+00	Amateurs de petit-beurre, unissez-vous !	Menacé par les industries proposant toujours plus de gâteaux fondants ou fourrés, il est temps pour nous de sauver le patrimoine nantais. Donnons-nous rdv pour inciter les foyers à acheter toujours plus de petit-beurre!	rue de Bouillé, Nantes	47.2259799	-1.5559296	/project-images/cd863952-69f1-11eb-ab25-1de322efb115.jpg	\N	f	21
17	2021-02-08 09:29:18.488481+00	2021-02-08 09:29:18.488481+00	2021-08-02 00:00:00+00	La polka c'est le feu	Nous allons mettre le feu avec une polka endiablé.	Robertsau 67000 Strasbourg	48.6114037	7.7879657	/project-images/23779bc8-69f0-11eb-ab25-1de322efb115.PNG	\N	f	19
9	2021-02-08 08:53:48.035865+00	2021-02-08 08:53:48.035865+00	2021-02-08 00:00:00+00	Clinique pour les pigeons	Nous allons venir en aide à ces petits animaux ailés qui peuplent nos rues, grâce à cette clinique spécialisé en médecine du pigeon.	Rue de la mirette 44000 Nantes	47.1666773	-1.5409388	/project-images/aa022496-69ec-11eb-ab25-1de322efb115.PNG	\N	f	9
22	2021-02-08 10:21:55.542563+00	2021-02-08 10:21:55.542563+00	2021-12-02 00:00:00+00	Coiffeur sur choucroute	recherchons coiffeur sur choucroute pour mise en plis et shampooing à la bière.	Ostwald	48.5425109	7.7102193	/project-images/d472bb72-69f7-11eb-ab25-1de322efb115.jpeg	\N	f	6
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: localhub
--

COPY public.favorites (id, user_id, project_id) FROM stdin;
4	14	10
5	15	9
8	12	2
9	16	10
10	16	17
11	6	10
12	6	11
13	6	12
14	6	9
15	3	9
16	3	7
19	9	13
20	9	18
21	9	7
22	9	12
23	9	11
24	9	17
25	9	10
33	3	18
35	3	3
36	3	14
37	2	7
38	2	18
39	2	9
40	15	7
43	13	5
44	13	19
45	6	7
\.


--
-- Data for Name: needs; Type: TABLE DATA; Schema: public; Owner: localhub
--

COPY public.needs (id, created_at, updated_at, title, description, completed, project_id) FROM stdin;
1	2021-02-07 17:01:38.934355+00	2021-02-07 17:01:38.934355+00	Une salle de répétition (20 pers)	Une salle de répétition disponible tous les samedis au mois de juillet 2021.	f	1
2	2021-02-07 17:03:12.045432+00	2021-02-07 17:03:12.045432+00	Une salle de représentation (150 pers.)	Une salle de représentation avec estrade (10m²) et 150 places assises. Pour la représentation du 08/08/2021	t	1
3	2021-02-07 17:19:24.058622+00	2021-02-07 17:19:24.058622+00	Un professionnel du maraichage	Un professionnel du maraichage BIO à proximité de Coueron, pour accueillir l'évènement un weekend de juillet. Date à discuter selon vos disponibilités. Nous attendons environs 300 personnes le temps du weekend.	f	2
4	2021-02-07 17:30:57.107372+00	2021-02-07 17:30:57.107372+00	Une / un chargé(e) d'insertion	Le/la chargé(e) d'insertion et d'accompagnement social intervient auprès des salariés en parcours d'insertion de la Régie de quartier ou du territoire en mettant en œuvre des dispositifs d'information, de sensibilisation, d'accompagnement et d'aide.	f	3
6	2021-02-08 08:22:01.723857+00	2021-02-08 08:22:01.723857+00	moutons électriques	des moutons électriques pour fournir de la laine pour les pulls	f	5
33	2021-02-08 10:23:18.933292+00	2021-02-08 10:23:18.933292+00	coiffeur	Coiffeur expérimenté en choucroute et choux frisés	f	22
13	2021-02-08 08:46:38.00619+00	2021-02-08 08:46:38.00619+00	Un max de personnes	Plus on est de fous plus on rit !	f	7
12	2021-02-08 08:46:05.49092+00	2021-02-08 08:46:05.49092+00	Des costumes colorés	Et amples pour pouvoir danser	t	7
14	2021-02-08 08:57:40.328153+00	2021-02-08 08:57:40.328153+00	webdesigner	un webdesigner qui aura la charge de concevoir le site du marché de Noël virtuel	f	10
15	2021-02-08 08:59:38.79953+00	2021-02-08 08:59:38.79953+00	Developpeur back	Developpeur back pour la base de données du site.	f	10
16	2021-02-08 09:00:40.880126+00	2021-02-08 09:00:40.880126+00	15 personnes 	prêtes à témoigner	f	11
17	2021-02-08 09:06:26.272379+00	2021-02-08 09:06:26.272379+00	infirmiers/infirmières spé pigeon	Nous recrutons des infirmiers/infirmières qualifiés en soin du pigeon.	f	9
18	2021-02-08 09:08:39.044958+00	2021-02-08 09:08:39.044958+00	Du chou	logique	f	12
19	2021-02-08 09:08:48.641431+00	2021-02-08 09:08:48.641431+00	des saucisses	en nombre	f	12
20	2021-02-08 09:16:31.201305+00	2021-02-08 09:16:31.201305+00	Des châtelains	Pour recréer du lien	f	13
21	2021-02-08 09:17:02.39762+00	2021-02-08 09:17:02.39762+00	Des laquets	Pour exprimer notre supériorité	t	13
22	2021-02-08 09:19:48.513103+00	2021-02-08 09:19:48.513103+00	associations, artistes, école d'art.	Proposer avant l'été un projet d'animation dans l'espace public autour des oeuvres du musée, celui restant fermé;	f	14
24	2021-02-08 09:30:33.88225+00	2021-02-08 09:30:33.88225+00	danseurs/danseuses	Nous avons de danseurs/danseuses spécialisés en polka freestyle.	f	17
25	2021-02-08 09:32:16.55792+00	2021-02-08 09:32:16.55792+00	musiciens/musiciennes	Nous recrutons des professionnels de l'accordéon maou maou  	f	17
26	2021-02-08 09:42:02.975862+00	2021-02-08 09:42:02.975862+00	Des amateurs de petit-beurre	Pour porter notre message ! 	f	18
27	2021-02-08 09:42:34.1014+00	2021-02-08 09:42:34.1014+00	Des affiches	Avec impressions et slogans novateurs	f	18
28	2021-02-08 09:42:44.585745+00	2021-02-08 09:42:44.585745+00	Des petit-beurre	A distribuer ! 	f	18
29	2021-02-08 09:47:36.667766+00	2021-02-08 09:47:36.667766+00	Sculpteur sur granit	Sculpteur sur granit équipé d'une lime et n'ayant pas le vertige.	t	19
5	2021-02-07 17:41:10.318156+00	2021-02-07 17:41:10.318156+00	Des parents motivé par le projet	Pour donner naissance à ce beau projet nous avons besoin de réunir 5 parents d'élèves qui siègerons au bureau d'administration de l'école.	f	4
\.


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: localhub
--

SELECT pg_catalog.setval('public.favorites_id_seq', 46, true);


--
-- Name: needs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: localhub
--

SELECT pg_catalog.setval('public.needs_id_seq', 41, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: localhub
--

SELECT pg_catalog.setval('public.projects_id_seq', 27, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: localhub
--

SELECT pg_catalog.setval('public.users_id_seq', 32, true);


--
-- PostgreSQL database dump complete
--


import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {useState} from "react";
import {Alert, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {PaginationControl} from "react-bootstrap-pagination-control";

type TUserItem = {
    id: number
    firstname: string
    lastname: string
    email: string
    phone: string
    updatedAt: string
}

type TGetServerSideProps = {
    statusCode: number
    users: TUserItem[]
}

const inter = Inter({subsets: ["latin"]});
const itemsPerPage = 20;

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
    try {
        const res = await fetch("http://localhost:3000/users", {method: 'GET'})
        if (!res.ok) {
            return {props: {statusCode: res.status, users: []}}
        }

        return {
            props: {statusCode: 200, users: await res.json()}
        }
    } catch (e) {
        return {props: {statusCode: 500, users: []}}
    }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users}: TGetServerSideProps) {
    const [totalPages, setTotalPages] = useState(Math.ceil(users.length / itemsPerPage))
    const [currentPage, setCurrentPage] = useState(1)

    if (statusCode !== 200) {
        return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
    }

    return (
        <>
            <Head>
                <title>Тестовое задание</title>
                <meta name="description" content="Тестовое задание"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={inter.className}>
                <Container>
                    <h1 className={'mb-5'}>Пользователи</h1>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Дата обновления</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage).map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>{user.updatedAt}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>

                    <Pagination>
                        <Pagination.First onClick={() => setCurrentPage(1)}/>
                        <PaginationControl
                            page={currentPage}
                            between={5}
                            total={totalPages}
                            limit={1}
                            changePage={(currentPage) => {
                                setCurrentPage(currentPage);
                            }}
                            ellipsis={0}
                        />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)}/>
                    </Pagination>
                </Container>
            </main>
        </>
    );
}

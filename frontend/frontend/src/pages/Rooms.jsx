import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "../styles/rooms.css";

function Rooms() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let currentUsername = "estudante";

    if (token) {

        try {

            const decodedToken = jwtDecode(token);

            if (decodedToken.sub) {
                currentUsername = decodedToken.sub;
            }

        } catch (error) {

            console.error(
                "Erro ao interpretar o token JWT:",
                error
            );

        }

    }


    /*
     * Encerra a sessão do usuário.
     */
    function handleLogout() {

        localStorage.removeItem("token");

        navigate("/login");

    }


    const rooms = [
        {
            id: 1,
            period: "1º Período"
        },
        {
            id: 2,
            period: "2º Período"
        },
        {
            id: 3,
            period: "3º Período"
        },
        {
            id: 4,
            period: "4º Período"
        },
        {
            id: 5,
            period: "5º Período"
        },
        {
            id: 6,
            period: "6º Período"
        }
    ];


    return (
        <main className="rooms-page">

            <header className="rooms-header">

                <div className="rooms-logo">
                    IFPE Chat
                </div>

                <div className="rooms-user">

                    <span>
                        Olá, {currentUsername}!
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>

                </div>

            </header>


            <section className="rooms-content">

                <div className="rooms-title">

                    <h1>
                        Escolha uma sala
                    </h1>

                    <p>
                        Entre em uma sala para conversar com
                        os estudantes do seu período.
                    </p>

                </div>


                <div className="rooms-grid">

                    {rooms.map((room) => (

                        <Link
                            key={room.id}
                            to={`/chat/${room.id}`}
                            className="room-card"
                        >

                            <div className="room-number">
                                {room.id}
                            </div>


                            <div className="room-info">

                                <h2>
                                    {room.period}
                                </h2>

                                <span>
                                    Entrar na sala
                                </span>

                            </div>


                            <div className="room-arrow">
                                →
                            </div>

                        </Link>

                    ))}

                </div>

            </section>

        </main>
    );
}

export default Rooms;
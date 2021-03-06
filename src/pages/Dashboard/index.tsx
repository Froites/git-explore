import React, { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import api from "../../services/api";

import logoImg from "../../assets/logo.svg"

import { Title, Form, Repositories, Error } from "./styles";

const Dashboard: React.FC = () => {

  interface Repository {
    full_name: string;
    description: string;
    owner: {
      login: string;
      avatar_url: string;

    }
  }

  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@QuizProject:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@QuizProject:repositories', JSON.stringify(repositories));
  }, [repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);
      console.log(response.data);

      const repository = response.data
      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }

    ;
  }

  return (
    <>
      <img src={logoImg} alt="GitExplore" />
      <Title>Liste os repositórios:</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          type="text" placeholder="Digite o nome do seu repositório..." />
        <button type="submit">Iniciar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />

            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>

        ))}
      </Repositories>
    </>
  )

};

export default Dashboard;

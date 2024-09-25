import { useState, useEffect } from "react";
import { Alert, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

type RouteParams = {
    group: string;
}

export function Players(){
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    async function handleAddPlayer(){
        if(newPlayerName.trim().length === 0){
            return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa.')
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group);
            fetchPlayersByTeam();
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('Nova Pessoa', error.message)
            } else {
                console.log(error);
                Alert.alert('Nova Pessoa', 'Não foi possível adicionar o player.');
            }
        }
    }

    async function fetchPlayersByTeam(){
        try {
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas.')
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return(
        <Container>
            <Header showBackButton/>

            <Highlight
                title={group}
                subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                    placeholder="Nome da pessoa"
                    onChangeText={setNewPlayerName}
                    autoCorrect={false}
                />

                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item.name}
                        onRemove={() => { }}  
                    />
                )}
                ListEmptyComponent={() => (
                    <ListEmpty 
                      message='Não há pessoas nesse time'
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && { flex: 1 }
                ]}
            />

            <Button
                title="Remover Turma"
                type="SECONDARY"
            />
        </Container>
    )
}
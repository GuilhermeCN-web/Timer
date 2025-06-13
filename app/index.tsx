import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';

const TimerApp = () => {
  const [time, setTime] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(true);
  const animatedValue = new Animated.Value(1);

  // Efeito para atualizar o tempo a cada segundo quando o cronômetro está rodando
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      
      animation.start();
  
      return () => animation.stop(); // Garante que a animação pare quando `isRunning` for `false`
    } else {
      animatedValue.setValue(1);
    }
  }, [isRunning, animatedValue]); // Agora monitoramos `animatedValue` também
  

  // Função para formatar o tempo (ex: 00:05:23)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.timer, { transform: [{ scale: animatedValue }] }]}>
        {formatTime(time)}
      </Animated.Text>

      <View style={styles.buttonContainer}>
        <Button title={isRunning ? 'Pausar' : 'Iniciar'} onPress={() => setIsRunning(!isRunning)} />
        <Button title="Resetar" onPress={() => { setIsRunning(false); setTime(0); }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  timer: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default TimerApp;

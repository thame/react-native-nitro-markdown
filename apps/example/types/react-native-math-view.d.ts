declare module 'react-native-math-view' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle, StyleProp, ViewProps } from 'react-native';

  export interface MathViewProps extends ViewProps {
    math: string;
    color?: string;
    style?: StyleProp<ViewStyle & Pick<TextStyle, 'color'>>;
    resizeMode?: 'contain' | 'cover';
    onError?: (error: Error) => void;
  }

  const MathView: ComponentType<MathViewProps>;
  export default MathView;
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from '@fluentui/react-button';
import { createDOMRenderer, makeStyles, RendererProvider } from '@fluentui/react-make-styles';
import { FluentProvider } from '../FluentProvider'; // codesandbox-dependency: @fluentui/react-components ^9.0.0-beta

const useExampleStyles = makeStyles({
  button: {
    marginTop: '5px',
  },
  text: theme => ({
    backgroundColor: theme.colorBrandBackground2,
    color: theme.colorBrandForeground2,
    fontSize: '20px',
    border: '1px',
    borderRadius: '5px',
    padding: '5px',
  }),
});

const useProviderStyles = makeStyles({
  provider: {
    border: '1px',
    borderRadius: '5px',
    padding: '5px',
  },
});

type FrameRendererProps = {
  children: (externalDocument: Document, renderer: ReturnType<typeof createDOMRenderer>) => React.ReactElement;
};

const FrameRenderer: React.FunctionComponent<FrameRendererProps> = ({ children }) => {
  const [frameRef, setFrameRef] = React.useState<HTMLIFrameElement | null>(null);

  const contentDocument = frameRef ? (frameRef.contentDocument as Document) : undefined;
  const renderer = React.useMemo(() => createDOMRenderer(contentDocument), [contentDocument]);

  return (
    <>
      <iframe
        ref={setFrameRef}
        style={{ height: 100, width: 500, border: '3px dashed salmon', padding: 10 }}
        title="An example of Provider in iframe"
      />
      {contentDocument && ReactDOM.createPortal(children(contentDocument, renderer), contentDocument.body)}
    </>
  );
};

const Example: React.FC = props => {
  const styles = useExampleStyles();

  return (
    <>
      <div className={styles.text}>{props.children}</div>
      <Button className={styles.button}>A button</Button>
    </>
  );
};

export const Frame = () => {
  const styles = useProviderStyles();

  return (
    <>
      <FluentProvider className={styles.provider}>
        <Example>Content rendered outside iframe</Example>
      </FluentProvider>

      <FrameRenderer>
        {(externalDocument, renderer) => (
          <RendererProvider renderer={renderer} targetDocument={externalDocument}>
            <FluentProvider className={styles.provider} targetDocument={externalDocument}>
              <Example>
                Content rendered <b>within</b> iframe
              </Example>
            </FluentProvider>
          </RendererProvider>
        )}
      </FrameRenderer>
    </>
  );
};

Frame.parameters = {
  docs: {
    description: {
      story:
        'A Fluent provider does not cross an iframee boundary.' +
        'Renderer provider supports Fluent provider within the iframe.',
    },
  },
};

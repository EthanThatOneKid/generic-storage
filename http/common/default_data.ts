/**
 * DefaultData is the data that is stored by the DefaultServer.
 *
 * The Key passed to the DefaultServer is the property name of the primary.
 * in a stored data record.
 */
export type DefaultData<Key extends string = "id"> =
  & {
    /**
     * Dev-defined primary key name.
     */
    $key: Key;

    /**
     * User-defined JSON properties.
     */
    [k: string]: unknown;
  }
  & {
    /**
     * Dev-defined property key.
     */
    [key in Key]: string;
  };

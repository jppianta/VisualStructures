import React, { Component } from 'react';

export class DocumentationPanel extends Component {
    render() {
        return (
            <div className="DocumentationPanel" style={{display: 'block', overflowY: 'auto'}}>
                <h1>VsLang</h1>
                <h2>Class</h2>
                <p>
                    Every module of this language is a essencialy a class, this is where all the definitions must be. Every class must have a definition of a Node, which will be explained next, and a name.
                    The most basic example of a class would be
                </p>
                <div className="Code">
                    <pre>
                        <code>
                            {"class Example {\n    Node {\n    }\n}"}
                        </code>
                    </pre>
                </div>
                <h2>Node</h2>
                <p>
                    The Node is a must have on every class because the ideia of the language is to work around data structures, and the best way to control data in data structures is with nodes. 
                    The way you define a Node is the same way you define parameters, type of the property followed by the name of the property. An example of a Node would be

                </p>
                <div className="Code">
                    <pre>
                        <code>
                            {"Node {\n"}
                            {"    number value,\n"}
                            {"    Node next\n"}
                            {"}"}
                        </code>
                    </pre>
                </div>
                <p>
                    The types available available in the language are number, string, bool and Node.
                </p>
                <h2>Declaration</h2>
                <p>
                    The declarations are the made writing the type of the variable, followed by the name of it, equals the value. For example
                </p>
                <div className="Code">
                    <pre>
                        <code>
                            {"Node root = Node(2);"}
                        </code>
                    </pre>
                </div>
                <p>
                    As you can see, we have just created a Node called root, with value equals 2. When calling functions, every property not passed on the function called will be set to null.
                    In this case, the property next of our variable is set to null, since a value was not passed.
                </p>
                <h2>Attribution</h2>
                <p>
                    Well, the attribution has not a lot of mistery, is the same as the declaration, but without the type definition. The variable must have already been defined, of course.
                </p>
                <h2>Function</h2>
                <p>
                    Functions are declared using the word 'fun', followed by its name and the parameters inside braces, followed by ':' and its return type.
                    The code of the function comes next inside curly braces. Just like this 
                </p>
                <div className="Code">
                    <pre>
                        <code>
                            {"fun add(number val): void {\n"}
                            {"    Node aux = root;\n"}
                            {"    if (aux == null) {\n"}
                            {"        Node aux = Node(val);\n"}
                            {"    } else {\n"}
                            {"        while (aux.next != null) {\n"}
                            {"            aux = aux.next;\n"}
                            {"        }\n"}
                            {"        aux.next = Node(val);\n"}
                            {"    }\n"}
                            {"}\n"}
                        </code>
                    </pre>
                </div>
                <p>
                    Preety cool, huh? And as you select the add function on the visualizer bar and press Run, you will see the root node being drawn. 
                    Remender, the first node declared will be the the one vizualied. At least for now.
                </p>
            </div>
        );
    }
}